import { Link, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { supabase } from "../lib/supabase";
import { useEffect, useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import { createPortal } from "react-dom";

interface Pacientes {
  id: number;
  nome_paciente: string;
  sobrenome_paciente: string;
  id_user: number;
  genero: string;
  status: string;
  data_nascimento: string;
}

const ALTURA_ESTIMADA_MENU = 320;
const LARGURA_MENU = 240;

function calcularIdade(dataDeNascimento: string | null) {
  if (!dataDeNascimento) return null;
  const hoje = new Date();
  const nascimento = new Date(dataDeNascimento);
  if (Number.isNaN(nascimento.getTime())) return null;

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();
  const mesNascimento = nascimento.getMonth();
  const diaNascimento = nascimento.getDate();

  if (
    mesAtual < mesNascimento ||
    (mesAtual === mesNascimento && diaAtual < diaNascimento)
  ) {
    idade--;
  }
  return idade;
}

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

export default function PacientesPage() {
  const navigate = useNavigate();

  const { IdUser } = useUser();
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [pacientes, setPacientes] = useState<Pacientes[]>([]);
  const [pacientesAtivos, setPacientesAtivos] = useState(0);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [confirmarAlta, setConfirmarAlta] = useState<Pacientes | null>(null);
  const [processando, setProcessando] = useState(false);
  const [buscaDePacientes, setBuscaDePacientes] = useState("");

  const [menuPos, setMenuPos] = useState<{
    top?: number;
    bottom?: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const pacienteDoMenu = pacientes.find((p) => p.id === menuAberto) ?? null;

  function abrirMenu(e: React.MouseEvent<HTMLButtonElement>, id: number) {
    if (menuAberto === id) {
      setMenuAberto(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const espacoAbaixo = window.innerHeight - rect.bottom;
    const espacoAcima = rect.top;
    const abrirParaCima =
      espacoAbaixo < ALTURA_ESTIMADA_MENU && espacoAcima > espacoAbaixo;

    const left = Math.max(8, rect.right - LARGURA_MENU);

    setMenuPos(
      abrirParaCima
        ? { bottom: window.innerHeight - rect.top + 8, left }
        : { top: rect.bottom + 8, left },
    );
    setMenuAberto(id);
  }

  useEffect(() => {
    async function carregarPacientes() {
      const { count: listaPacientes, error: errorLista } = await supabase
        .from("pacientes")
        .select("*", { count: "exact", head: true })
        .eq("id_user", IdUser);

      if (listaPacientes) {
        setTotalPacientes(listaPacientes || 0);
      } else {
        console.log(errorLista);
      }

      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("id_user", IdUser);

      if (data) {
        setPacientes(data);
      } else {
        console.log(error);
      }

      const { count: pacientesAtivos, error: pacientesAtivosError } =
        await supabase
          .from("pacientes")
          .select("*", { count: "exact", head: true })
          .eq("id_user", IdUser)
          .eq("status", "Tratamento ativo");

      if (pacientesAtivos) {
        setPacientesAtivos(pacientesAtivos);
      } else {
        console.log(pacientesAtivosError);
      }
    }

    carregarPacientes();
  }, [IdUser]);

  async function darAlta() {
    if (!confirmarAlta || processando) return;

    setProcessando(true);

    const id = confirmarAlta.id;

    const { error } = await supabase
      .from("pacientes")
      .update({ status: "Alta" })
      .eq("id", id)
      .eq("id_user", IdUser)
      .eq("status", "Tratamento ativo");

    setProcessando(false);

    if (error) {
      console.error("Erro ao dar alta:", error);
      alert("Não foi possível dar alta ao paciente.");
      return;
    }

    setPacientes((lista) =>
      lista.map((p) => (p.id === id ? { ...p, status: "Alta" } : p)),
    );

    setPacientesAtivos((total) => Math.max(0, total - 1));
    setConfirmarAlta(null);
  }

  async function reativarPaciente(paciente: Pacientes) {
    if (processando) return;

    setProcessando(true);

    const { error } = await supabase
      .from("pacientes")
      .update({ status: "Tratamento ativo" })
      .eq("id", paciente.id)
      .eq("id_user", IdUser)
      .eq("status", paciente.status);

    setProcessando(false);

    if (error) {
      console.error("Erro ao reativar:", error);
      alert("Não foi possível reativar o tratamento.");
      return;
    }

    setPacientes((lista) =>
      lista.map((p) =>
        p.id === paciente.id ? { ...p, status: "Tratamento ativo" } : p,
      ),
    );

    setPacientesAtivos((total) => total + 1);
    setMenuAberto(null);
  }

  useEffect(() => {
    if (menuAberto === null) return;

    const fechar = () => setMenuAberto(null);

    function aoClicarFora(e: MouseEvent) {
      const alvo = e.target as HTMLElement;
      if (menuRef.current?.contains(alvo)) return;
      if (alvo.closest("[data-menu-trigger]")) return;
      setMenuAberto(null);
    }

    function aoApertarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuAberto(null);
    }

    window.addEventListener("resize", fechar);
    window.addEventListener("scroll", fechar, true); // true = captura scroll de qualquer container
    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoApertarTecla);

    return () => {
      window.removeEventListener("resize", fechar);
      window.removeEventListener("scroll", fechar, true);
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoApertarTecla);
    };
  }, [menuAberto]);

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const termo = normalizarTexto(buscaDePacientes.trim());
    const nomeCompleto = `${paciente.nome_paciente ?? ""} ${paciente.sobrenome_paciente ?? ""}`;
    return normalizarTexto(nomeCompleto).includes(termo);
  });

  const itemMenu =
    "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:bg-emerald-50";

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
              <span className="font-semibold">Pacientes</span>
            </nav>

            {/* Cabeçalho */}
            <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Lista de pacientes
                </h2>
                <p className="max-w-xl text-gray-600">
                  Gerencie seus pacientes, acompanhe evoluções clínicas e agende
                  consultas com eficiência.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-black/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                    <span className="material-symbols-outlined">
                      diversity_1
                    </span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-medium text-gray-500">
                      Total de pacientes
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      {totalPacientes}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-black/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                    <span className="material-symbols-outlined">
                      health_and_safety
                    </span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-medium text-gray-500">
                      Em tratamento
                    </span>
                    <span className="text-2xl font-bold tabular-nums text-primary-dark">
                      {pacientesAtivos}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Busca e ações */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:flex-row">
              <div className="relative w-full md:w-96">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  value={buscaDePacientes}
                  onChange={(e) => setBuscaDePacientes(e.target.value)}
                  aria-label="Buscar paciente"
                  className="block w-full rounded-xl border-none bg-gray-50 py-3 pl-10 pr-3 text-sm ring-1 ring-gray-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Buscar paciente..."
                  type="text"
                />
              </div>
              <div className="flex w-full gap-3 md:w-auto">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                  <span className="material-symbols-outlined text-xl">
                    filter_list
                  </span>
                  Filtrar
                </button>
                <Link
                  to="/registro"
                  className="flex min-w-[180px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark hover:shadow-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 md:flex-none"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                  Novo paciente
                </Link>
              </div>
            </div>

            {/* Tabela */}
            <div className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70 text-sm text-gray-500">
                      <th className="px-6 py-4 font-semibold">Nome</th>
                      <th className="px-6 py-4 font-semibold">Idade / Gênero</th>
                      <th className="px-6 py-4 font-semibold">
                        Última evolução
                      </th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pacientesFiltrados.map((paciente) => {
                      const idade = calcularIdade(paciente.data_nascimento);
                      const ativo = paciente.status === "Tratamento ativo";

                      return (
                        <tr 
                          key={paciente.id}
                          className="cursor-pointer transition-colors hover:bg-primary/5"
                        >
                          

                          <Link to={`/pacientes/${paciente.id}`} className="px-6 py-4 align-middle">
                            <div className="flex items-center gap-3">
                              <img
                                className="size-11 rounded-full bg-gray-100 object-cover ring-2 ring-white"
                                src={`https://api.dicebear.com/10.x/personas/svg?seed=${paciente.id}`}
                                alt=""
                              />

                              <div className="flex flex-col leading-tight">
                                <span className="text-base font-bold">
                                  {paciente.nome_paciente}{" "}
                                  {paciente.sobrenome_paciente}
                                </span>

                                <span className="text-xs text-gray-400 tabular-nums">
                                  ID #{paciente.id}
                                </span>
                              </div>
                            </div>
                          </Link>

                          <td className="px-6 py-4 align-middle">
                            <div className="text-sm font-medium">
                              {idade !== null
                                ? `${idade} anos`
                                : "Não informado"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {paciente.genero || "Não informado"}
                            </div>
                          </td>

                          <td className="px-6 py-4 align-middle">
                            <div className="flex items-center gap-2 text-gray-600">
                              <span className="material-symbols-outlined text-base">
                                person
                              </span>
                              <span className="text-sm font-medium">
                                Paciente cadastrado
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 align-middle">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                ativo
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  ativo ? "bg-green-600" : "bg-gray-500"
                                }`}
                              />
                              {paciente.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right align-middle">
                            <button
                              type="button"
                              data-menu-trigger
                              aria-label={`Ações de ${paciente.nome_paciente}`}
                              aria-expanded={menuAberto === paciente.id}
                              onClick={(e) => abrirMenu(e, paciente.id)}
                              className={`rounded-full p-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                                menuAberto === paciente.id
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "text-gray-400 hover:bg-gray-100 hover:text-primary"
                              }`}
                            >
                              <span className="material-symbols-outlined">
                                more_vert
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {pacientesFiltrados.length === 0 && (
                  <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                      <span className="material-symbols-outlined">
                        {buscaDePacientes ? "search_off" : "group"}
                      </span>
                    </div>
                    <p className="font-semibold">
                      {buscaDePacientes
                        ? "Nenhum paciente encontrado"
                        : "Você ainda não tem pacientes"}
                    </p>
                    <p className="max-w-xs text-sm text-gray-500">
                      {buscaDePacientes
                        ? "Confira se o nome está certo ou tente buscar só pelo primeiro nome."
                        : "Cadastre seu primeiro paciente para começar."}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-auto flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 md:flex-row">
                <p className="text-sm text-gray-600">
                  Mostrando{" "}
                  <span className="font-semibold">
                    {pacientesFiltrados.length}
                  </span>{" "}
                  de <span className="font-semibold">{totalPacientes}</span>{" "}
                  pacientes
                </p>
                <div className="flex gap-2">
                  <button
                    disabled
                    className="rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    disabled
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center pb-8 pt-4">
              <p className="text-center text-xs text-gray-500">
                © 2026 FisioHub. Todos os direitos reservados. <br />
                Informações confidenciais do paciente.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de alta */}
      {confirmarAlta && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !processando)
              setConfirmarAlta(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-alta"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <span className="material-symbols-outlined text-2xl">
                check_circle
              </span>
            </div>

            <h3 id="titulo-alta" className="text-xl font-bold text-gray-900">
              Dar alta ao paciente?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Deseja realmente dar alta a{" "}
              <strong>
                {confirmarAlta.nome_paciente} {confirmarAlta.sobrenome_paciente}
              </strong>
              ? O status será alterado para Alta.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={processando}
                onClick={() => setConfirmarAlta(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={processando}
                onClick={darAlta}
                className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50"
              >
                {processando ? "Processando..." : "Confirmar alta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu de ações */}
      {menuAberto !== null &&
        pacienteDoMenu &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: "fixed",
              top: menuPos.top,
              bottom: menuPos.bottom,
              left: menuPos.left,
              width: LARGURA_MENU,
            }}
            className="z-[1000] overflow-hidden rounded-2xl bg-white py-2 text-left shadow-xl ring-1 ring-black/5"
          >
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400">Ações do paciente</p>
              <p className="mt-0.5 truncate text-sm font-bold text-gray-800">
                {pacienteDoMenu.nome_paciente}{" "}
                {pacienteDoMenu.sobrenome_paciente}
              </p>
            </div>

            <div className="py-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuAberto(null);
                  navigate(`/pacientes/${pacienteDoMenu.id}`)
                }}
                className={itemMenu}
              >
                <span className="material-symbols-outlined text-xl text-gray-500">
                  folder_open
                </span>
                Ver prontuário
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  navigate("/novaevolucao", {
                    state: {
                      idPaciente: pacienteDoMenu.id,
                    },
                  });
                  setMenuAberto(null);
                }}
                className={itemMenu}
              >
                <span className="material-symbols-outlined text-xl text-gray-500">
                  clinical_notes
                </span>
                Registrar evolução
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuAberto(null);
                  console.log("Editar cadastro:", pacienteDoMenu.id);
                }}
                className={itemMenu}
              >
                <span className="material-symbols-outlined text-xl text-gray-500">
                  edit
                </span>
                Editar cadastro
              </button>
            </div>

            {(pacienteDoMenu.status === "Tratamento ativo" ||
              pacienteDoMenu.status === "Alta") && (
              <div className="border-t border-gray-100 pt-1">
                {pacienteDoMenu.status === "Tratamento ativo" ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuAberto(null);
                      setConfirmarAlta(pacienteDoMenu);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:bg-emerald-50"
                  >
                    <span className="material-symbols-outlined text-xl">
                      check_circle
                    </span>
                    Dar alta ao paciente
                  </button>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => reativarPaciente(pacienteDoMenu)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:bg-blue-50"
                  >
                    <span className="material-symbols-outlined text-xl">
                      restart_alt
                    </span>
                    Reativar tratamento
                  </button>
                )}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}