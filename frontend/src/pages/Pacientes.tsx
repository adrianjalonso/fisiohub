import { Link, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { supabase } from "../lib/supabase";
import { useEffect, useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import { createPortal } from "react-dom";


export default function Pacientes() {
  interface Pacientes {
    id: number;
    nome_paciente: string;
    sobrenome_paciente: string;
    id_user: number;
    genero: string;
    status: string;
    data_nascimento: string;
  }

  const navigate = useNavigate()

  function calcularIdade(dataDeNascimento: string) {
    const hoje = new Date();
    const nascimento = new Date(dataDeNascimento);
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

  const { IdUser } = useUser();
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [pacientes, setPacientes] = useState<Pacientes[]>([]);
  const [pacientesAtivos, setPacientesAtivos] = useState(0);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [confirmarAlta, setConfirmarAlta] = useState<Pacientes | null>(null);
  const [processando, setProcessando] = useState(false);
  const [buscaDePacientes, setBuscaDePacientes] = useState("")
  

  const ALTURA_ESTIMADA_MENU = 320
  const LARGURA_MENU = 240

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

function normalizarTexto(texto: string){
  return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();
}

const pacientesFiltrados = pacientes.filter((paciente)=>{
  const termo = normalizarTexto(buscaDePacientes)
  return normalizarTexto(paciente.nome_paciente).includes(termo)
})

  return (
    <div className="h-screen overflow-hidden flex flex-row">
      <Menu />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-100/60 to-transparent pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p12 z-10 scroll-smooth">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <nav className="flex items-center text-sm font-medium">
              <Link
                to="/dashboard"
                className="transition-colors hover: text-primary"
              >
                Painel
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span>Pacientes</span>
            </nav>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                  Lista de pacientes
                </h2>
                <p className="text-base max-w-xl">
                  Gerencie seus pacientes, acompanhe evoluções clínicas e agende
                  consultas com eficiência.
                </p>
              </div>
              <div className="hidden lg:flex gap-6">
                <div className="flex flex-col items-end px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Total de pacientes
                  </span>
                  <span className="text-2xl font-bold">{totalPacientes}</span>
                </div>
                <div className="flex flex-col items-end px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Ativos hoje
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {pacientesAtivos}
                  </span>
                </div>
              </div>
            </header>
            <div className="p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined transition-colors">
                    search
                  </span>
                </div>
                <input onChange={(e)=>setBuscaDePacientes(e.target.value)}
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
                  to="/registro"
                  className="flex-1 md:flex-none items-center justify-center px-6 py-3 rounded-lg bg-primary text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex gap-2 min-w-[180px]"
                >
                  <span className="material-symbols-outlined">add</span>
                  Novo paciente
                </Link>
              </div>
            </div>
            <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider w-16">
                        <input
                          className="rounded border-gray-300 text-primary focus:rong-primary bg-transparent"
                          type="checkbox"
                        />
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider ">
                        Nome
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider ">
                        Idade/ Gênero
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider ">
                        Ultima evolução
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider ">
                        Status
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider  text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pacientesFiltrados.map((paciente) => (
                      <tr
                        key={paciente.id}
                        className="hover:bg-primary/5 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6 align-middle">
                          <input
                            className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                            type="checkbox"
                          />
                        </td>

                        <td className="py-4 px-6 align-middle">
                          <div className="flex items-center gap-3">
                            <img
                              className="size-10 rounded-full object-cover bg-gray-200"
                              src={`https://api.dicebear.com/10.x/personas/svg?seed=${paciente.id}`}
                              alt={paciente.nome_paciente}
                            />

                            <div className="flex flex-col">
                              <span className="font-bold text-base">
                                {paciente.nome_paciente}{" "}
                                {paciente.sobrenome_paciente}
                              </span>

                              <span className="text-xs text-primary/90">
                                ID: #{paciente.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 align-middle">
                          <div className="text-sm">
                            {`${calcularIdade(paciente.data_nascimento)} anos` ||
                              "Não informado"}
                          </div>
                          <div className="text-xs">
                            {paciente.genero || "Não informado"}
                          </div>
                        </td>

                        <td className="py-4 px-6 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">
                              person
                            </span>

                            <span className="text-sm font-medium">
                              Paciente cadastrado
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 align-middle">
                          <span
                            className={`${paciente.status === "Tratamento ativo" ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" : "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"} `}
                          >
                            <span
                              className={`${paciente.status === "Tratamento ativo" ? "w-1.5 h-1.5 rounded-full bg-green-600" : "w-1.5 h-1.5 rounded-full bg-gray-500"} `}
                            />
                            <span className="" />
                            {paciente.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 align-middle text-right">
  <button
    type="button"
    data-menu-trigger
    aria-label={`Ações de ${paciente.nome_paciente}`}
    aria-expanded={menuAberto === paciente.id}
    onClick={(e) => abrirMenu(e, paciente.id)}
    className={`rounded-full p-2 transition-colors ${
      menuAberto === paciente.id
        ? "bg-emerald-100 text-emerald-700"
        : "text-gray-400 hover:bg-gray-100 hover:text-primary"
    }`}
  >
    <span className="material-symbols-outlined">more_vert</span>
  </button>
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                

{confirmarAlta && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
    <div
      role="dialog"
      aria-modal="true"
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <span className="material-symbols-outlined text-2xl">
          check_circle
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900">
        Dar alta ao paciente?
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        Deseja realmente dar alta a{" "}
        <strong>
          {confirmarAlta.nome_paciente}{" "}
          {confirmarAlta.sobrenome_paciente}
        </strong>
        ? O status será alterado para Alta.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          disabled={processando}
          onClick={() => setConfirmarAlta(null)}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={processando}
          onClick={darAlta}
          className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {processando ? "Processando..." : "Confirmar alta"}
        </button>
      </div>
    </div>
  </div>
)}


              </div>
              <div className="mt-auto border-t border-gray-100 px-6 py-4 flex flex-col md:flex-row items-center justify-center gap-4">
                <p className="text-sm">
                  Mostrando <span className="font-medium">1-5</span> de{" "}
                  <span className="font-medium">{totalPacientes}</span>{" "}
                  pacientes
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium bg-transparent border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    Anterior
                  </button>
                  <button className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    Próximo
                  </button>
                </div>
              </div>
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
      className="z-[1000] overflow-hidden rounded-xl border border-gray-100 bg-white py-2 text-left shadow-xl"
    >
      <div className="border-b border-gray-100 px-4 py-3">
        <p className="text-xs text-gray-400">AÇÕES DO PACIENTE</p>
        <p className="mt-1 truncate text-sm font-bold text-gray-800">
          {pacienteDoMenu.nome_paciente} {pacienteDoMenu.sobrenome_paciente}
        </p>
      </div>

      <button
        onClick={() => {
          setMenuAberto(null);
          console.log("Prontuário:", pacienteDoMenu.id);
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50"
      >
        <span className="material-symbols-outlined text-xl">folder_open</span>
        Ver prontuário
      </button>

      <button
      type="button"
        onClick={() => {
          navigate("/novaevolucao",{
            state:{
              idPaciente:pacienteDoMenu.id
            }
          })
          setMenuAberto(null)
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50"
      >
        <span className="material-symbols-outlined text-xl">clinical_notes</span>
        Registrar evolução
      </button>

      <button
        onClick={() => {
          setMenuAberto(null);
          console.log("Editar cadastro:", pacienteDoMenu.id);
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50"
      >
        <span className="material-symbols-outlined text-xl">edit</span>
        Editar cadastro
      </button>

      <div className="my-2 border-t border-gray-100" />

      {pacienteDoMenu.status === "Tratamento ativo" ? (
        <button
          onClick={() => {
            setMenuAberto(null);
            setConfirmarAlta(pacienteDoMenu);
          }}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50"
        >
          <span className="material-symbols-outlined text-xl">check_circle</span>
          Dar alta ao paciente
        </button>
      ) : pacienteDoMenu.status === "Alta" ? (
        <button
          onClick={() => reativarPaciente(pacienteDoMenu)}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-blue-700 hover:bg-blue-50"
        >
          <span className="material-symbols-outlined text-xl">restart_alt</span>
          Reativar tratamento
        </button>
      ) : null}
    </div>,
    document.body,
  )}
    </div>
  );
}
 