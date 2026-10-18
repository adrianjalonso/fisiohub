import Menu from "../components/Menu";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect,useState } from "react";
import { useUser } from "../context/UserContext";

export default function NovaEvolucao() {

  interface ListaPacientes {
    nome_paciente: string,
    id: number
  }

  const location = useLocation()
  const idPacienteRecebido = location.state?.idPaciente

  const {IdUser} = useUser()
  const [listaPacientes, setListaPacientes] = useState<ListaPacientes[]>([])
  const [evolucao, setEvolucao] = useState("")
  const [idPaciente, setIdPaciente] = useState<number>(idPacienteRecebido??0)

  useEffect(() => {
  async function carregarPacientes() {
    const { data, error } = await supabase
      .from("pacientes")
      .select("nome_paciente, id")
      .eq("id_user", IdUser);

    if (error) {
      console.error("Erro ao carregar pacientes:", error);
      return;
    }

    setListaPacientes(data ?? []);
  }

  if (IdUser) {
    carregarPacientes();
  }
}, [IdUser]);



  async function salvarEvolucao(e: any) {
  e.preventDefault();

  if (!idPaciente || !evolucao.trim()) {
    alert("Seleciona um paciente e escreve a evolução.");
    return;
  }

  const { error } = await supabase
    .from("evolucoes")
    .insert({
      paciente_id: idPaciente,
      fisioterapeuta_id: IdUser,
      texto: evolucao.trim(),
    });

  if (error) {
    console.error("Erro ao salvar evolução:", error);
    alert(`Erro ao salvar: ${error.message}`);
    return;
  }

  alert("Evolução salva com sucesso!");
  setEvolucao("");
  setIdPaciente(0);
}
  


  return (
    <div className="h-screen overflow-hidden flex flex-row">
      <Menu />
      <main className="flex-grow h-full flex flex-col overflow-scroll items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[800px] flex flex-col gap-6">
          <nav className="flex items-center text-sm font-medium">
            <Link
              to="/dashboard"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              Painel
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link
              to="/evolucoes"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              Evoluçoes
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary font-semibold">Nova evolução</span>
          </nav>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Nova evolução
            </h1>
          </div>
          <form className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100 gap-4 flex flex-col">
              <div className=" grid grid-cols-1 gap-6 ">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Paciente
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">
                      person
                    </span>

                    <select
                    value={idPaciente === 0 ? "" : String(idPaciente)}
                    onChange={(e)=>{
                      const idSelecionado = Number(e.target.value);
                      setIdPaciente(idSelecionado)
                    }}
                      className="w-full rounded-lg border-gray-200 bg-gray-100 pl-11 pr-10 py-3 focus:border-primary focus:ring-primary sm:text-sm transition-all appearance-none"
                    >
                      <option value="" disabled>
                        Selecione um paciente...
                      </option>
                      {listaPacientes.map((paciente)=>{
                        return(
                          <option key={paciente.id} value={String(paciente.id)} >{paciente.nome_paciente}</option>
                        )
                      }   
                      )} 
                    </select>

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
              <textarea value={evolucao} onChange={(e)=> setEvolucao(e.target.value)} className="w-full rounded-lg border-gray-200 bg-gray-100 p-4 placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all resize-none" placeholder="Descreva a evoluçao do paciente... " rows={6}></textarea>
            </div>
            
            <div className="px-6 py-4 md:px-8 md-py-6 bg-gray-50 flex justify-end items-center gap-4 border-t border-gray-100">
              <button
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
                type="button"
              >
                Cancelar
              </button>
              <button
              onClick={salvarEvolucao}
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-black text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">
                  check
                </span>
                Salvar evolução
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
