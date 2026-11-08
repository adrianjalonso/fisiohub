import express from "express";
import cors from "cors"
import router from "./routes/auth.routes.js";
import pacientesRouter from "./routes/pacientes.routes.js";
import agendamentosRouter from "./routes/agendamentos.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import evolucoesRouter from "./routes/evolucoes.routes.js"

const app = express();

app.use(cors());
app.use(express.json())
  app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use("/pacientes", pacientesRouter)
app.use("/agendamentos", agendamentosRouter)
app.use("/dashboard", dashboardRouter)

app.get("/", (req,res)=>{
  res.send("API do FisioHub funcionandoo!")
})

app.use("/auth",router)

app.listen(3000,()=>{
  console.log("Servidor rodando!")
})