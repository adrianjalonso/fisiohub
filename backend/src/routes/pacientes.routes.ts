import { Router } from "express"
import { supabase } from "../database/supabase.js"
import { autenticar } from "../middlewares/auth.middleware.js"

const router = Router()
router.use(autenticar)

function idValido(v: string) {
  const n = Number(v)
  return Number.isInteger(n) && n > 0 ? n : null
}

// Busca/lista simples (usada pela busca do painel e pelo select de agendamento)
router.get("/", async (req, res) => {
  const userId = (req as any).userId
  const busca = String(req.query.busca ?? "").trim()

  let query = supabase
    .from("pacientes")
    .select("id, nome_paciente")
    .eq("id_user", userId)

  busca
    .split(/\s+/)
    .map((t) => t.replace(/[%,()]/g, ""))
    .filter(Boolean)
    .forEach((t) => {
      query = query.or(
        `nome_paciente.ilike.%${t}%`
      )
    })

  const { data, error } = await query
    .order("nome_paciente", { ascending: true })
    .limit(busca ? 8 : 500)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Lista completa para a página de pacientes (com as evoluções)
router.get("/detalhado", async (req, res) => {
  const userId = (req as any).userId

  const { data, error } = await supabase
    .from("pacientes")
    .select("*, evolucoes(id, paciente_id, patologia, texto, created_at)")
    .eq("id_user", userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Cadastro de paciente: o dono é SEMPRE o usuário do token
router.post("/", async (req, res) => {
  const userId = (req as any).userId
  const {
    nome_paciente,
    data_nascimento,
    idade,
    email,
    telefone,
    endereco,
    genero,
    anamnese,
  } = req.body

  const nome = String(nome_paciente ?? "").trim()
  if (!nome) {
    return res.status(400).json({ error: "O nome do paciente é obrigatório" })
  }

  const idadeNum = Number(idade)

  const { data, error } = await supabase
    .from("pacientes")
    .insert({
      nome_paciente: nome,
      data_nascimento: data_nascimento || null,
      idade: Number.isFinite(idadeNum) ? idadeNum : null,
      email: email || null,
      telefone: telefone || null,
      endereco: endereco || null,
      genero: genero || null,
      anamnese: String(anamnese ?? "").trim() || null,
      id_user: userId,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// Dar alta / reativar tratamento
router.patch("/:id/status", async (req, res) => {
  const userId = (req as any).userId
  const { status } = req.body

  if (status !== "Alta" && status !== "Tratamento ativo") {
    return res.status(400).json({ error: "Status inválido" })
  }

  // só permite a transição esperada
  const statusAnterior = status === "Alta" ? "Tratamento ativo" : "Alta"

  const { data, error } = await supabase
    .from("pacientes")
    .update({ status })
    .eq("id", Number(req.params.id))
    .eq("id_user", userId)
    .eq("status", statusAnterior)
    .select("id")

  if (error) return res.status(500).json({ error: error.message })
  if (!data || data.length === 0) {
    return res
      .status(404)
      .json({ error: "Paciente não encontrado ou status já alterado" })
  }

  res.json({ ok: true })
})

// Ficha: dados do paciente + evoluções
router.get("/:id/ficha", async (req, res) => {
  const userId = (req as any).userId
  const id = idValido(req.params.id)
  if (!id) return res.status(400).json({ error: "Id inválido" })

  const { data: paciente, error } = await supabase
    .from("pacientes")
    .select(
      "id, nome_paciente, data_nascimento, genero, email, telefone, endereco, status, idade, anamnese"
    )
    .eq("id", id)
    .eq("id_user", userId)
    .maybeSingle()

  if (error) return res.status(500).json({ error: error.message })
  if (!paciente) return res.json({ paciente: null, evolucoes: [] })

  const { data: evolucoes, error: erroEvolucoes } = await supabase
    .from("evolucoes")
    .select("id, patologia, texto, created_at")
    .eq("paciente_id", paciente.id)
    .order("created_at", { ascending: false })

  if (erroEvolucoes) return res.status(500).json({ error: erroEvolucoes.message })
  res.json({ paciente, evolucoes: evolucoes ?? [] })
})

// Dados para exportar o prontuário (já em ordem cronológica)
router.get("/:id/exportacao", async (req, res) => {
  const userId = (req as any).userId
  const id = idValido(req.params.id)
  if (!id) return res.status(400).json({ error: "Id inválido" })

  const { data: paciente, error: erroPaciente } = await supabase
    .from("pacientes")
    .select("id")
    .eq("id", id)
    .eq("id_user", userId)
    .maybeSingle()

  if (erroPaciente) return res.status(500).json({ error: erroPaciente.message })
  if (!paciente) return res.status(404).json({ error: "Paciente não encontrado" })

  const { data, error } = await supabase
    .from("evolucoes")
    .select("id, patologia, texto, created_at, agendamentos(data_hora, tipo)")
    .eq("paciente_id", paciente.id)

  if (error) return res.status(500).json({ error: error.message })

  const itens = (data ?? [])
    .map((r: any) => {
      const ag = Array.isArray(r.agendamentos) ? r.agendamentos[0] : r.agendamentos
      return {
        id: r.id,
        patologia: r.patologia,
        texto: r.texto,
        created_at: r.created_at,
        data_atendimento: ag?.data_hora ?? r.created_at,
        tipo: ag?.tipo ?? null,
      }
    })
    .sort(
      (a, b) =>
        new Date(a.data_atendimento).getTime() -
        new Date(b.data_atendimento).getTime()
    )

  res.json(itens)
})

// Editar cadastro
router.patch("/:id", async (req, res) => {
  const userId = (req as any).userId
  const id = idValido(req.params.id)
  if (!id) return res.status(400).json({ error: "Id inválido" })

  const b = req.body
  const nome = String(b.nome_paciente ?? "").trim()
  if (!nome) return res.status(400).json({ error: "O nome é obrigatório" })

  const idadeNum = Number(b.idade)

  const atualizacao = {
    nome_paciente: nome,
    data_nascimento: b.data_nascimento || null,
    idade: Number.isFinite(idadeNum) ? idadeNum : 0,
    genero: String(b.genero ?? ""),
    email: String(b.email ?? "").trim(),
    telefone: String(b.telefone ?? "").replace(/\D/g, ""),
    endereco: String(b.endereco ?? "").trim(),
    anamnese: String(b.anamnese ?? "").trim() || null,
  }

  const { data, error } = await supabase
    .from("pacientes")
    .update(atualizacao)
    .eq("id", id)
    .eq("id_user", userId)
    .select("id")

  if (error) return res.status(500).json({ error: error.message })
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Paciente não encontrado" })
  }

  res.json({ ok: true })
})

export default router