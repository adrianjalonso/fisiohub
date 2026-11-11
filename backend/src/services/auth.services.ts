import { supabase } from "../database/supabase.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function registerService(
  nome: string,
  email: string,
  password: string,
  titulo: string,
  crefito: string
) {
  if (!nome || !email || !password) {
    throw new Error("Todos os campos são obrigatorios")
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("user_email", email)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (data) {
    throw new Error("Usuário ja cadastrado!")
  }

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({
      user_nome: nome,
      user_email: email,
      senha: passwordHash,
      titulo: titulo,
      crefito: crefito
    })
    .select()
    .single()

  if (insertError) {
    throw new Error(insertError.message)
  }

  // não devolve o hash da senha
  const { senha, ...userSeguro } = newUser
  return userSeguro
}

export async function buscarPerfilService(userId: number) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error("Usuário não encontrado")
  }

  const { senha, ...userSeguro } = data
  return userSeguro
}

export async function atualizarPerfilService(
  userId: number,
  dados: { nome: string; titulo: string; email: string; crefito: string }
) {
  const nome = String(dados.nome ?? "").trim()
  const email = String(dados.email ?? "").trim()
  const titulo = String(dados.titulo ?? "").trim()
  const crefito = String(dados.crefito ?? "").trim()

  if (!nome || !email) {
    throw new Error("Nome e e-mail são obrigatórios")
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("E-mail inválido")
  }

  const { data: existente, error: erroBusca } = await supabase
    .from("users")
    .select("user_id")
    .eq("user_email", email)
    .neq("user_id", userId)
    .maybeSingle()

  if (erroBusca) {
    throw new Error(erroBusca.message)
  }

  if (existente) {
    throw new Error("Este e-mail já está em uso")
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      user_nome: nome,
      user_email: email,
      titulo: titulo,
      crefito: crefito,
    })
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const { senha, ...userSeguro } = data
  return userSeguro
}

export async function loginService(email: string, password: string) {
  if (!email || !password) {
    throw new Error("E-mail e senha são obrigatórios")
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_email", email.trim())
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  // mesma mensagem para e-mail inexistente e senha errada
  const ok = user && (await bcrypt.compare(password, user.senha))
  if (!ok) {
    throw new Error("E-mail ou senha inválidos")
  }

  const token = jwt.sign(
    { sub: user.user_id },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" }
  )

  // remove o hash antes de enviar ao front-end
  const { senha, ...userSeguro } = user
  return { token, user: userSeguro }
}