import express from "express";
import cors from "cors"
import router from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json())

app.get("/", (req,res)=>{
  res.send("API do FisioHub funcionando!")
})

app.use("/auth",router)

app.listen(3000,()=>{
  console.log("Servidor rodando!")
})