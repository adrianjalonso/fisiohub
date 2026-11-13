import { Router } from "express"
import { supabase } from "../database/supabase.js"
import { autenticar } from "../middlewares/auth.middleware.js"

const router = Router()
router.use(autenticar)

function somarDias(dataStr: string, n: number) {
  const d = new Date(`${dataStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

async function contarAgendamentos(userId: number, de: string, ate: string) {
  const { count, error } = await supabase
    .from("agendamentos")
    .select("id, pacientes!inner(id_user)", { count: "exact", head: true })
    .eq("pacientes.id_user", userId)
    .gte("data_hora", `${de}T00:00:00`)
    .lt("data_hora", `${ate}T00:00:00`)
  if (error) throw new Error(error.message)
  return count ?? 0
}

async function contarNovosPacientes(userId: number, de: string, ate: string) {
  const { count, error } = await supabase
    .from("pacientes")
    .select("id", { count: "exact", head: true })
    .eq("id_user", userId)
    .gte("created_at", de)
    .lte("created_at", ate)
  if (error) throw new Error(error.message)
  return count ?? 0
}

router.get("/resumo", async (req, res) => {
  try {
    const userId = (req as any).userId
    const { agora, iniSem, fimSem, iniSemPass, fimSemPass } =
      req.query as Record<string, string>

    // agora = horário local do usuário, ex.: 2026-11-08T14:30:00
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(agora ?? "")) {
      return res.status(400).json({ error: "Parâmetro 'agora' inválido" })
    }
    for (const v of [iniSem, fimSem, iniSemPass, fimSemPass]) {
      if (!v || Number.isNaN(Date.parse(v))) {
        return res.status(400).json({ error: "Intervalo de semana inválido" })
      }
    }

    const hoje = agora.slice(0, 10)
    const ontem = somarDias(hoje, -1)
    const amanha = somarDias(hoje, 1)

    const [
      atendimentosHoje,
      atendimentosOntem,
      novosPacientesSemana,
      novosPacientesSemanaPassada,
      totalPacientesRes,
      agendaRes,
      pendentesRes,
    ] = await Promise.all([
      contarAgendamentos(userId, hoje, amanha),
      contarAgendamentos(userId, ontem, hoje),
      contarNovosPacientes(userId, iniSem, fimSem),
      contarNovosPacientes(userId, iniSemPass, fimSemPass),
      supabase
        .from("pacientes")
        .select("id", { count: "exact", head: true })
        .eq("id_user", userId),
      supabase
        .from("agendamentos")
        .select("*, pacientes!inner(nome_paciente, id_user)")
        .eq("pacientes.id_user", userId)
        .gte("data_hora", `${hoje}T00:00:00`)
        .lt("data_hora", `${amanha}T00:00:00`)
        .order("data_hora", { ascending: true }),
      supabase
        .from("pacientes")
        .select(
          `id, nome_paciente, telefone, email,
           agendamentos!inner ( id, data_hora, status, evolucoes ( id ) )`
        )
        .eq("id_user", userId)
        .lte("agendamentos.data_hora", agora),
    ])

    if (totalPacientesRes.error) throw new Error(totalPacientesRes.error.message)
    if (agendaRes.error) throw new Error(agendaRes.error.message)
    if (pendentesRes.error) throw new Error(pendentesRes.error.message)

    // Considera concluído todo atendimento cujo horário já passou,
    // exceto os cancelados e os que já têm evolução registrada.
    const pendentes = ((pendentesRes.data ?? []) as any[])
      .map((p) => ({
        ...p,
        agendamentos: (p.agendamentos ?? []).filter(
          (a: any) => a.status !== "Cancelado" && a.evolucoes.length === 0
        ),
      }))
      .filter((p) => p.agendamentos.length > 0)

    const totalPendentes = pendentes.reduce(
      (total, p) => total + p.agendamentos.length,
      0
    )

    res.json({
      atendimentosHoje,
      atendimentosOntem,
      totalPacientes: totalPacientesRes.count ?? 0,
      novosPacientesSemana,
      novosPacientesSemanaPassada,
      agendamentosHoje: agendaRes.data ?? [],
      pendentes,
      totalPendentes,
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router