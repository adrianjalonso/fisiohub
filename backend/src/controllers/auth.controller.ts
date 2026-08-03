import { Response,Request } from "express"
import {registerService} from "../services/auth.services.js"

async function register(req: Request, res: Response) {
  const {name,email,password} = req.body

  const result = await registerService(name,email,password)

  res.status(201).json(result)
}


export default register