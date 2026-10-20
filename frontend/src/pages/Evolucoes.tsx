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

const PACIENTES_POR_PAGINA = 10;

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function iniciais(nome?: string | null) {
  const partes = (nome ?? "").trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export default function Evolucoes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const { IdUser } = useUser();

  useEffect(() => {
    async function buscarPacientes() {
      setLoading(true);
      setErro(null);

      const { data, error } = await supabase
        .from("pacientes")
        .select(
          `id,nome_paciente,id_user,evolucoes(id,paciente_id,patologia,texto,created_at)`,
        )
        .eq("id_user", IdUser);

      if (error) {
        console.error("Error ao buscar pacientes:", error);
        setErro("Não foi possível carregar os pacientes.");
      } else {
        setPacientes(data ?? []);
      }

      setLoading(false);
    }

    buscarPacientes();
  }, [IdUser]);

  // Busca sem acentos
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const termo = normalizarTexto(busca.trim());
    return normalizarTexto(paciente.nome_paciente ?? "").includes(termo);
  });

  // Paginação da lista de pacientes
  const totalPacientes = pacientesFiltrados.length;
  const totalPaginas = Math.ceil(totalPacientes / PACIENTES_POR_PAGINA);
  const indiceInicial = (paginaAtual - 1) * PACIENTES_POR_PAGINA;
  const indiceFinal = indiceInicial + PACIENTES_POR_PAGINA;

  const pacientesPagina = pacientesFiltrados.slice(indiceInicial, indiceFinal);

  const botaoPagina =
    "flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <Menu />
      <main className="relative flex h-full flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-64 w-full bg-gradient-to-b from-emerald-100/60 to-transparent"></div>
        <div className="z-10 flex-1 scroll-smooth overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">
            {/* Breadcrumb */}
            <nav
              className="flex items-center text-sm font-medium"
              aria-label="Você está em"
            >
              <Link
                to="/dashboard"
                className="text-gray-500 transition-colors hover:text-primary-dark"
              >
                Painel
              </Link>
              <span className="material-symbols-outlined mx-1 text-base text-gray-400">
                chevron_right
              </span>
              <span className="font-semibold">Evoluções</span>
            </nav>

            {/* Cabeçalho */}
            <header className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Histórico de evoluções
              </h2>
              <p className="max-w-xl text-gray-600">
                Acompanhe a última evolução de cada paciente e abra o prontuário
                completo.
              </p>
            </header>

            {/* Busca e ação */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:flex-row">
              <div className="relative w-full md:w-96">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setPaginaAtual(1);
                  }}
                  aria-label="Buscar paciente"
                  className="block w-full rounded-xl border-none bg-gray-50 py-3 pl-10 pr-3 text-sm ring-1 ring-gray-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Buscar paciente..."
                  type="text"
                />
              </div>
              <div className="flex w-full gap-3 md:w-auto">
                <Link
                  to="/novaevolucao"
                  className="flex min-w-[180px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark hover:shadow-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 md:flex-none"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                  Nova evolução
                </Link>
              </div>
            </div>

            {/* Lista */}
            <div className="flex flex-col gap-3">
              {loading && (
                <div className="flex flex-col gap-3" aria-busy="true">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-28 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
                    />
                  ))}
                </div>
              )}

              {erro && (
                <div
                  role="alert"
                  className="flex items-center gap-3 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600 ring-1 ring-red-100"
                >
                  <span className="material-symbols-outlined">error</span>
                  {erro}
                </div>
              )}

              {!loading && !erro && pacientesFiltrados.length === 0 && (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-black/5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                    <span className="material-symbols-outlined">
                      {busca ? "search_off" : "clinical_notes"}
                    </span>
                  </div>
                  <p className="font-semibold">
                    {busca
                      ? "Nenhum paciente encontrado"
                      : "Nenhum paciente cadastrado"}
                  </p>
                  <p className="max-w-xs text-sm text-gray-500">
                    {busca
                      ? "Confira se o nome está certo ou tente buscar só pelo primeiro nome."
                      : "Cadastre um paciente para começar a registrar evoluções."}
                  </p>
                </div>
              )}

              {!loading &&
                !erro &&
                pacientesPagina.map((paciente) => {
                  const ultimaEvolucao = [...paciente.evolucoes].sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  )[0];
                  const quantidade = paciente.evolucoes.length;

                  return (
                    <article
                      key={paciente.id}
                      className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md md:flex-row md:items-center md:gap-6 md:p-6"
                    >
                      {/* Paciente */}
                      <div className="flex items-center gap-4 md:w-1/3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
                          {iniciais(paciente.nome_paciente)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold leading-tight">
                            {paciente.nome_paciente}
                          </h3>
                          <p className="text-xs text-gray-400 tabular-nums">
                            Prontuário #{paciente.id}
                          </p>
                          <p className="mt-1.5 truncate text-sm text-gray-600">
                            <span className="text-gray-400">Patologia: </span>
                            {ultimaEvolucao?.patologia ?? "Não informado"}
                          </p>
                        </div>
                      </div>

                      {/* Última evolução */}
                      <div className="min-w-0 flex-1 border-gray-100 md:border-l md:pl-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm text-gray-500">
                            Última evolução
                          </p>
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-dark">
                            {quantidade === 1
                              ? "1 registro"
                              : `${quantidade} registros`}
                          </span>
                        </div>
                        <p className="mt-0.5 text-lg font-bold text-primary-dark">
                          {ultimaEvolucao
                            ? new Date(
                                ultimaEvolucao.created_at,
                              ).toLocaleDateString("pt-BR")
                            : "Nenhuma evolução"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {ultimaEvolucao?.texto ?? "Não informado"}
                        </p>
                      </div>

                      {/* Ação */}
                      <Link
                        to={`/pacientes/${paciente.id}`}
                        className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                      >
                        Ver prontuário completo
                        <span className="material-symbols-outlined text-base">
                          arrow_forward
                        </span>
                      </Link>
                    </article>
                  );
                })}
            </div>

            {/* Paginação */}
            {!loading && !erro && totalPacientes > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-gray-600">
                  Mostrando{" "}
                  <span className="font-semibold">
                    {Math.min(indiceFinal, totalPacientes) - indiceInicial}
                  </span>{" "}
                  pacientes de{" "}
                  <span className="font-semibold">{totalPacientes}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Página anterior"
                    onClick={() => setPaginaAtual((pagina) => pagina - 1)}
                    disabled={paginaAtual === 1}
                    className={botaoPagina}
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                  <span className="px-3 text-sm font-medium tabular-nums">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <button
                    aria-label="Próxima página"
                    onClick={() => setPaginaAtual((pagina) => pagina + 1)}
                    disabled={paginaAtual === totalPaginas}
                    className={botaoPagina}
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-center pb-8 pt-4">
              <p className="text-center text-xs text-gray-500">
                © 2026 FisioHub. Todos os direitos reservados. <br />
                Informações confidenciais do paciente.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}