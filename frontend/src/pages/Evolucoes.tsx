import { useState, useEffect } from "react";
import Menu from "../components/Menu";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";

interface Paciente {
  id: string;
  nome_paciente: string;
  evolucoes: Evolucoes[];
}

interface Evolucoes {
  id: string;
  paciente_id: string;
  patologia: string | null;
  texto: string | null;
  created_at: string;
}

export default function Evolucoes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const {IdUser} = useUser()

  const pacientesPorPagina = 10;

  useEffect(() => {
    async function buscarPacientes() {
      setLoading(true);
      setErro(null);

      const { data, error } = await supabase
        .from("pacientes")
        .select(
          `id,nome_paciente,id_user,evolucoes(id,paciente_id,patologia,texto,created_at)`,
        ).eq("id_user",IdUser);

      if (error) {
        console.error("Error ao buscar pacientes:", error);
        setErro("Não foi possivel carregar os pacientes.");
      } else {
        setPacientes(data??[]);
      }

      setLoading(false);
    }

    buscarPacientes();
  }, [IdUser]);

  //Busqueda sem acentos
  function normalizarTexto(texto: string) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();
  }

  //Busqueda
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const termo = normalizarTexto(busca);
    return normalizarTexto(paciente.nome_paciente).includes(termo);
  });


  // Paginación de lista de pacientes
  const totalPacientes = pacientesFiltrados.length;

  const totalPaginas = Math.ceil(totalPacientes/pacientesPorPagina)
  const indiceInicial = (paginaAtual-1)*pacientesPorPagina;
  const indiceFinal = indiceInicial+pacientesPorPagina;

  const pacientesPagina = pacientesFiltrados.slice(indiceInicial,indiceFinal)

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
                  value={busca}
                  onChange={(e) => {setBusca(e.target.value);
                    setPaginaAtual(1)
                  }}
                  className="block w-full pl-10 pr-3 py-3 border-none ring-1 ring-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                  placeholder="Buscar paciente..."
                  type="text"
                />
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <Link
                  to="/novaevolucao"
                  className="flex-1 md:flex-none items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex gap-2 min-w-[180px]"
                >
                  <span className="material-symbols-outlined">add</span>
                  Nova Evoluçao
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {loading && (
                <p className="text-center py-8 text-gray-500">
                  Carregando pacientes...
                </p>
              )}
              {erro && <p className="text-center py-8 text-red-500">{erro}</p>}
              {!loading && !erro && pacientesFiltrados.length === 0 && (
                <p className="text-center py-8 text-gray-500">
                  Nenhum paciente encontrado
                </p>
              )}
              {!loading &&
                !erro &&
                pacientesPagina.map((paciente) => {
                  const ultimaEvolucao = [...paciente.evolucoes].sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  )[0];
                  return (
                    <figure
                      key={paciente.id}
                      className="bg-white px-6 py-4 border border-primary/35 hover:translate-x-1 hover:-translate-y-1 rounded-xl flex justify-between items-center transition-all hover:shadow-md duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-primary flex items-center justify-center font-bold">
                          {paciente.nome_paciente
                            ?.split("")
                            .splice(0, 2)
                            .map((nome) => nome[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-[20px] font-bold text-primary leading-tight">
                            {paciente.nome_paciente}
                          </h3>
                          <p className="text-sm text-on-surface-variant">
                            Prontuario: #{paciente.id}
                            <p className="text-gray-400">Patologia</p>
                            <p>
                              {ultimaEvolucao?.patologia ?? "Não informado"}
                            </p>
                          </p>
                        </div>
                      </div>
                      <div className="w-2/4">
                        <p>Última evolução</p>
                        <p className="text-primary font-bold text-lg">
                          {ultimaEvolucao
                            ? new Date(
                                ultimaEvolucao.created_at,
                              ).toLocaleDateString("pt-BR")
                            : "Nenhuma evolução"}
                        </p>
                        <p>{ultimaEvolucao?.texto ?? "Não informado"}</p>
                      </div>

                      <Link
                        to={`/pacientes/${paciente.id}`}
                        className="text-primary hover:bg-status-info-bg px-3 py-1.5 rounded-lg text-sm transition-colors border border-primary hover:bg-primary hover:text-white"
                      >
                        Ver Prontuario completo
                      </Link>
                    </figure>
                  );
                })}
            </div>
            {!loading&&!erro&& totalPacientes>0&&(
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                <p className="text-sm text-gray-500">
                  Mostrando{" "}
                  <span className="font-semibold text-primary">
                    {Math.min(indiceFinal,totalPacientes)-indiceInicial}
                  </span>{" "}
                  pacientes de{" "}
                  <span className="font-semibold text-primary">
                    {totalPacientes}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setPaginaAtual((pagina)=>pagina-1)}
                    disabled={paginaAtual===1}
                    className="size-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                  <span className="px-3 text-sm font-medium">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <button
                  onClick={()=> setPaginaAtual((pagina)=>pagina+1)}
                  disabled={paginaAtual===totalPaginas} className="size-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ">
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            )}
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
