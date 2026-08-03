import { Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import Login from "./Login"
import Dashboard from "./Dashboard"
import Pacientes from "./Pacientes"
import Registro from "./Registro"
import FichaPaciente from "./FichaPaciente"
import Cadastro from "./Cadastro"

export default function App() {

  const [titulo, setTitulo] = useState("")
  const [sobrenome, setSobrenome] = useState("")
  const [IdUser, setIdUser] = useState(()=>{
    const id = localStorage.getItem("IdUser");
    return id ? Number(id): 0
  })

  useEffect(() => {
  const titulo = localStorage.getItem("titulo");
  const sobrenome = localStorage.getItem("sobrenome");
  const idUser = localStorage.getItem("IdUser");

  if (titulo) setTitulo(titulo);
  if (sobrenome) setSobrenome(sobrenome);
  if (idUser) setIdUser(Number(idUser));
}, []);

  return (
    <div className="h-screen w-screen">
    <Routes> 
      <Route path="/" element={<Login  setTitulo={setTitulo} setSobrenome={setSobrenome} setIdUser={setIdUser}  />} />
      <Route path="/login" element={<Login  setTitulo={setTitulo} setSobrenome={setSobrenome} setIdUser={setIdUser} />} />
      <Route path="cadastro" element={<Cadastro/>}/>
      <Route path="/dashboard" element={<Dashboard titulo={titulo} sobrenome={sobrenome} IdUser={IdUser}/>} />
      <Route path="/pacientes" element={<Pacientes/>} />
      <Route path="/registro" element={<Registro IdUser={IdUser} />} />
      <Route path="/fichapaciente" element={<FichaPaciente />} />
    </Routes>
    </div>
  )
}


