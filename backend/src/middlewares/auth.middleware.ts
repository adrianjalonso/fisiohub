import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Não autenticado" })
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as { sub: string | number }
    ;(req as any).userId = Number(payload.sub)
    next()
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" })
  }
}