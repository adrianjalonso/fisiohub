import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Registro from "./pages/Registro";
import FichaPaciente from "./pages/FichaPaciente";
import Cadastro from "./pages/Cadastro";
import { UserProvider } from "./context/UserContext";
import Agenda from "./pages/Agenda";
import Settings from "./pages/Settings";

export default function App() {
  const [titulo, setTitulo] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [IdUser, setIdUser] = useState(() => {
    const id = localStorage.getItem("IdUser");
    return id ? Number(id) : 0;
  });

  useEffect(() => {
    const titulo = localStorage.getItem("titulo");
    const sobrenome = localStorage.getItem("sobrenome");
    const idUser = localStorage.getItem("IdUser");

    if (titulo) setTitulo(titulo);
    if (sobrenome) setSobrenome(sobrenome);
    if (idUser) setIdUser(Number(idUser));
  }, []);

  return (
    <UserProvider titulo={titulo} sobrenome={sobrenome} IdUser={IdUser}>
      <div className="h-screen w-screen">
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setTitulo={setTitulo}
              setSobrenome={setSobrenome}
              setIdUser={setIdUser}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setTitulo={setTitulo}
              setSobrenome={setSobrenome}
              setIdUser={setIdUser}
            />
          }
        />
        <Route path="cadastro" element={<Cadastro />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/registro" element={<Registro IdUser={IdUser} />} />
        <Route path="/fichapaciente" element={<FichaPaciente />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
    </UserProvider>
    
  );
}
