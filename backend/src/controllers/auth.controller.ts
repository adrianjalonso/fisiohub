import { Response, Request } from "express"
import {
  registerService,
  loginService,
  buscarPerfilService,
  atualizarPerfilService,
} from "../services/auth.services.js"

export async function register(req: Request, res: Response) {
  try {
    const { nome, email, password, titulo, crefito } = req.body
    const result = await registerService(nome, email, password, titulo, crefito)
    res.status(201).json(result)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const result = await loginService(email, password)
    res.json(result)
  } catch (e: any) {
    res.status(401).json({ error: e.message })
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const result = await buscarPerfilService(userId)
    res.json(result)
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { nome, titulo, email, crefito } = req.body
    const result = await atualizarPerfilService(userId, {
      nome,
      titulo,
      email,
      crefito,
    })
    res.json(result)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
}