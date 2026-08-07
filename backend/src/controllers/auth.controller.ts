import { Response,Request } from "express"
import {registerService} from "../services/auth.services.js"

async function register(req: Request, res: Response) {
  const {nome,email,password,titulo,crefito} = req.body

  const result = await registerService(nome,email,password,titulo,crefito)

  res.status(201).json(result)
}


export default register