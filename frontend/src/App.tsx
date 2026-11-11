import { Route, Routes } from "react-router-dom";
import { useCallback, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Registro from "./pages/Registro";
import FichaPaciente from "./pages/FichaPaciente";
import Cadastro from "./pages/Cadastro";
import { UserProvider, type DadosUsuario } from "./context/UserContext";
import Agenda from "./pages/Agenda";
import Settings from "./pages/Settings";
import Evolucoes from "./pages/Evolucoes";
import NovaEvolucao from "./pages/NovaEvolucao";
import NovoAgendamento from "./pages/NovoAgendamento";
import EvolucoesPendentes from "./pages/EvolucoesPendentes";


export default function App() {
  const [titulo, setTitulo] = useState(
    () => localStorage.getItem("titulo") ?? ""
  );
  const [nome, setNome] = useState(
    () => localStorage.getItem("nome") ?? ""
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem("email") ?? ""
  );
  const [IdUser, setIdUser] = useState(() => {
    const id = localStorage.getItem("IdUser");
    return id ? Number(id) : 0;
  });

  const atualizarUsuario = useCallback((dados: DadosUsuario) => {
    setNome(dados.nome);
    setEmail(dados.email);
    setTitulo(dados.titulo);
    localStorage.setItem("nome", dados.nome);
    localStorage.setItem("email", dados.email);
    localStorage.setItem("titulo", dados.titulo);
  }, []);

  return (
    <UserProvider
      titulo={titulo}
      IdUser={IdUser}
      nome={nome}
      email={email}
      atualizarUsuario={atualizarUsuario}
    >
      <div className="min-h-dvh w-full">
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setTitulo={setTitulo}
              setIdUser={setIdUser}
              setNome={setNome}
              setEmailUsuario={setEmail}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setTitulo={setTitulo}
              setIdUser={setIdUser}
              setNome={setNome}
              setEmailUsuario={setEmail}
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
        <Route path="/pacientes/:id" element={<FichaPaciente />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/evolucoes" element={<Evolucoes />} />
        <Route path="/novaevolucao" element={<NovaEvolucao />} />
        <Route path="/novoagendamento" element={<NovoAgendamento />} />
        <Route path="/evolucoespendentes" element={<EvolucoesPendentes />} />
      </Routes>
    </div>
    </UserProvider>
    
  );
}
