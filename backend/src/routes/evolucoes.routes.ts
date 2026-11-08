import { Router } from "express"
import { supabase } from "../database/supabase.js"
import { autenticar } from "../middlewares/auth.middleware.js"

const router = Router()
router.use(autenticar)

router.post("/", async (req, res) => {
  const userId = (req as any).userId
  const pacienteId = Number(req.body.paciente_id)
  const agendamentoId = Number(req.body.id_agendamento)
  const texto = String(req.body.texto ?? "").trim()

  if (!pacienteId || !agendamentoId || !texto) {
    return res.status(400).json({ error: "Dados inválidos" })
  }

  // o paciente precisa ser do usuário logado
  const { data: paciente, error: erroPaciente } = await supabase
    .from("pacientes")
    .select("id")
    .eq("id", pacienteId)
    .eq("id_user", userId)
    .maybeSingle()

  if (erroPaciente) return res.status(500).json({ error: erroPaciente.message })
  if (!paciente) return res.status(404).json({ error: "Paciente não encontrado" })

  // o atendimento precisa ser desse paciente e ainda não ter evolução
  const { data: ag, error: erroAg } = await supabase
    .from("agendamentos")
    .select("id, evolucoes(id)")
    .eq("id", agendamentoId)
    .eq("paciente_id", paciente.id)
    .maybeSingle()

  if (erroAg) return res.status(500).json({ error: erroAg.message })
  if (!ag) return res.status(404).json({ error: "Atendimento não encontrado" })
  if ((ag as any).evolucoes?.length > 0) {
    return res.status(409).json({ error: "Esse atendimento já tem evolução" })
  }

  const { data, error } = await supabase
    .from("evolucoes")
    .insert({
      paciente_id: paciente.id,
      id_agendamento: ag.id,
      fisioterapeuta_id: userId,
      texto,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

export default router