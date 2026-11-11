import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/auth.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/perfil", autenticar, getProfile)
router.patch("/perfil", autenticar, updateProfile)

export default router
