import { useState,useEffect } from "react";
import Menu from "../components/Menu";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Paciente {
  id: string,
  nome_paciente:string,
}

export default function Evolucoes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null);

  useEffect(()=>{
    async function buscarPacientes(){
      setLoading(true);
      setErro(null);

      const {data,error} = await supabase.from("pacientes").select("*").order("created_at",{ascending: false})

      if (error){
        console.error("Error ao buscar pacientes:",error)
        setErro("Não foi possivel carregar os pacientes.")
      } else {
        setPacientes(data)
      }

      setLoading(false)
    }

    buscarPacientes()
  },[])
  
  return (
    <div className="h-screen overflow-hidden flex flex-row">
      <Menu />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p12 z-10 scroll-smooth">
          <div className="max-w-7xl mx-auto flex flex-col gap-2">
            <nav className="flex items-center text-sm font-medium">
              <Link
                to="/dashboard"
                className="transition-colors hover: text-primary"
              >
                Painel
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span>Evoluçoes</span>
            </nav>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 ">
              <div className="flex flex-col gap-2 ">
                <h2 className="text-3xl md:text-4xl font-black ">
                  Historico de evoluçoes
                </h2>
              </div>
            </header>
            <div className="p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined transition-colors">
                    search
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border-none ring-1 ring-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                  placeholder="Buscar paciente..."
                  type="text"
                />
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <button className="flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                  Filtrar
                </button>
                <Link
                  to="/novaevolucao"
                  className="flex-1 md:flex-none items-center justify-center px-6 py-3 rounded-lg bg-primary text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex gap-2 min-w-[180px]"
                >
                  <span className="material-symbols-outlined">add</span>
                  Nova Evoluçao
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {loading&& (
                <p className="text-center py-8 text-gray-500">
                  Carregando pacientes...
                </p>
              )}
              {erro&&(
                <p className="text-center py-8 text-red-500">
                  {erro}
                </p>
              )}
              {!loading&&!erro&& pacientes.length ===0 &&(
                <p className="text-center py-8 text-gray-500">
                  Nenhum paciente encontrado
                </p>
              )}
              {!loading&&!erro&&pacientes.map((paciente)=>{
                return(
                <figure key={paciente.id} className="bg-white px-6 py-4 border border-primary/35 hover:translate-x-1 hover:-translate-y-1 rounded-xl flex justify-between items-center transition-all hover:shadow-md duration-200">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary flex items-center justify-center font-bold">
                    {paciente.nome_paciente?.split("").splice(0,2).map((nome)=>nome[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold text-primary leading-tight">
                        {paciente.nome_paciente}
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        Prontuario: #{paciente.nome_paciente}
                        {" • "}
                        {paciente.nome_paciente}
                      </p>
                    </div>
                  </div>

                  <Link to={`/pacientes/${paciente.id}`} className="text-primary hover:bg-status-info-bg px-3 py-1.5 rounded-lg text-sm transition-colors border border-transparent hover:border-primary/20">
                  Ver Prontuario completo
                  </Link>

                </figure>
              )})}
            </div>
            <div className="flex justify-center pb-8 pt-4">
              <p className="text-xs text-center text-primary">
                © 2026 FisioHub. Todos os direitos reservados. <br />
                Informações Confidenciais do Paciente.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
