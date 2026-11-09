import express from "express";
import cors from "cors"
import router from "./routes/auth.routes.js";
import pacientesRouter from "./routes/pacientes.routes.js";
import agendamentosRouter from "./routes/agendamentos.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import evolucoesRouter from "./routes/evolucoes.routes.js"

const app = express();

// FRONTEND_URL aceita uma ou várias origens separadas por vírgula.
// Sem a variável, o CORS fica liberado (útil para previews da Vercel).
const origensPermitidas = process.env.FRONTEND_URL
  ?.split(",")
  .map((origem) => origem.trim())
  .filter(Boolean)

app.use(cors(origensPermitidas?.length ? { origin: origensPermitidas } : {}))
app.use(express.json())

app.use("/pacientes", pacientesRouter)
app.use("/agendamentos", agendamentosRouter)
app.use("/dashboard", dashboardRouter)
app.use("/evolucoes", evolucoesRouter)

app.get("/", (req,res)=>{
  res.send("API do FisioHub funcionandoo!")
})

app.use("/auth",router)

const porta = Number(process.env.PORT ?? 3000)

// Na Vercel o app é executado como função serverless; o listen só roda
// em ambiente local ou em hosts com processo persistente.
if (!process.env.VERCEL) {
  app.listen(porta,()=>{
    console.log(`Servidor rodando na porta ${porta}!`)
  })
}

export default app;
