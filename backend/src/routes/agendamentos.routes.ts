import { Router } from "express"
import { supabase } from "../database/supabase.js"
import { autenticar } from "../middlewares/auth.middleware.js"

const router = Router()
router.use(autenticar)

const TIPOS = ["Atendimento", "Avaliação"]

// Agenda: todos os agendamentos dos pacientes do usuário logado
router.get("/", async (req, res) => {
  const userId = (req as any).userId

  const { data, error } = await supabase
    .from("agendamentos")
    .select(
      "id, paciente_id, data_hora, tipo, status, observacao, pacientes!inner(id, nome_paciente, id_user)"
    )
    .eq("pacientes.id_user", userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Atendimentos já realizados e sem evolução registrada
router.get("/pendentes-evolucao", async (req, res) => {
  const userId = (req as any).userId
  const agora = String(req.query.agora ?? "")

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(agora)) {
    return res.status(400).json({ error: "Parâmetro 'agora' inválido" })
  }

  const { data, error } = await supabase
    .from("agendamentos")
    .select(
      `id, data_hora, tipo, status, observacao, evolucoes ( id ),
       pacientes!inner ( id, nome_paciente, id_user )`
    )
    .eq("pacientes.id_user", userId)
    .lte("data_hora", agora)
    .order("data_hora", { ascending: true })

  if (error) return res.status(500).json({ error: error.message })

  // Considera concluído todo atendimento cujo horário já passou,
  // exceto os cancelados e os que já têm evolução registrada.
  const pendentes = (data ?? []).filter(
    (a: any) =>
      a.status !== "Cancelado" &&
      (!a.evolucoes || a.evolucoes.length === 0)
  )
  res.json(pendentes)
})

// Atendimentos passados de um paciente que ainda não têm evolução
router.get("/sem-evolucao", async (req, res) => {
  const userId = (req as any).userId
  const pacienteId = Number(req.query.paciente_id)
  const agora = String(req.query.agora ?? "")

  if (!Number.isInteger(pacienteId) || pacienteId <= 0) {
    return res.status(400).json({ error: "Paciente inválido" })
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(agora)) {
    return res.status(400).json({ error: "Parâmetro 'agora' inválido" })
  }

  const { data: paciente, error: erroPaciente } = await supabase
    .from("pacientes")
    .select("id")
    .eq("id", pacienteId)
    .eq("id_user", userId)
    .maybeSingle()

  if (erroPaciente) return res.status(500).json({ error: erroPaciente.message })
  if (!paciente) return res.status(404).json({ error: "Paciente não encontrado" })

  const { data, error } = await supabase
    .from("agendamentos")
    .select("id, data_hora, tipo, status, evolucoes(id)")
    .eq("paciente_id", paciente.id)
    .lte("data_hora", agora)
    .order("data_hora", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  const semEvolucao = (data ?? []).filter(
    (a: any) =>
      a.status !== "Cancelado" &&
      (!a.evolucoes || a.evolucoes.length === 0)
  )
  res.json(semEvolucao)
})

router.post("/", async (req, res) => {
  const userId = (req as any).userId
  const { paciente_id, data_hora, tipo, observacao } = req.body

  if (!paciente_id || !data_hora || !TIPOS.includes(tipo)) {
    return res.status(400).json({ error: "Dados inválidos" })
  }

  const { data: paciente, error: erroPaciente } = await supabase
    .from("pacientes")
    .select("id")
    .eq("id", Number(paciente_id))
    .eq("id_user", userId)
    .maybeSingle()

  if (erroPaciente) return res.status(500).json({ error: erroPaciente.message })
  if (!paciente) return res.status(404).json({ error: "Paciente não encontrado" })

  const { data, error } = await supabase
    .from("agendamentos")
    .insert({
      paciente_id: paciente.id,
      data_hora,
      tipo,
      status: "Agendado",
      observacao: String(observacao ?? "").trim(),
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

export default router