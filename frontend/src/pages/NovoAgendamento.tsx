import Menu from "../components/Menu";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

interface Paciente {
  id: number;
  nome_paciente: string;
  sobrenome_paciente: string;
  id_user: number;
}

const TIPOS = [
  {
    valor: "Atendimento",
    descricao: "Sessão de fisioterapia",
    icone: "medical_services",
  },
  {
    valor: "Avaliação",
    descricao: "Avaliação inicial",
    icone: "assignment",
  },
];

const HORARIOS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// O input type="date" exige o formato AAAA-MM-DD
function dataDeHojeParaInput() {
  const hoje = new Date();
  return (
    hoje.getFullYear() +
    "-" +
    String(hoje.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(hoje.getDate()).padStart(2, "0")
  );
}

export default function NovoAgendamento() {
  const { IdUser } = useUser();
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState("");
  const [tipo, setTipo] = useState("Atendimento");
  const [data, setData] = useState(dataDeHojeParaInput());
  const [hora, setHora] = useState("09:00");
  const [observacao, setObservacao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPacientes() {
      if (!IdUser) return;

      const { data, error } = await supabase
        .from("pacientes")
        .select("id, nome_paciente, sobrenome_paciente, id_user")
        .eq("id_user", IdUser)
        .order("nome_paciente");

      if (error) {
        console.error("Erro ao carregar pacientes:", error);
        setErro("Não foi possível carregar os pacientes.");
        return;
      }

      setPacientes(data ?? []);
    }

    carregarPacientes();
  }, [IdUser]);

  async function salvarAgendamento(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    if (!pacienteId || !data || !hora || !tipo) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);

    const dataHora = `${data}T${hora}:00`;

    const { error } = await supabase.from("agendamentos").insert({
      paciente_id: Number(pacienteId),
      data_hora: dataHora,
      tipo,
      status: "Agendado",
      observacao: observacao.trim(),
    });

    setSalvando(false);

    if (error) {
      console.error("Erro ao salvar agendamento:", error);
      setErro("Não foi possível salvar. Verifique os dados e tente novamente.");
      return;
    }

    navigate("/agenda");
  }

  const campo =
    "w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-800 ring-1 ring-gray-200 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary";
  const rotulo = "text-sm font-medium text-gray-700";

  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <Menu />

      <main className="relative flex h-full flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-64 w-full bg-gradient-to-b from-emerald-100/60 to-transparent" />

        <div className="z-10 flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
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
              <Link
                to="/agenda"
                className="text-gray-500 transition-colors hover:text-primary-dark"
              >
                Agenda
              </Link>
              <span className="material-symbols-outlined mx-1 text-base text-gray-400">
                chevron_right
              </span>
              <span className="font-semibold">Novo agendamento</span>
            </nav>

            {/* Cabeçalho */}
            <header className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
                <span className="material-symbols-outlined text-3xl">
                  calendar_add_on
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Novo agendamento
                </h2>
                <p className="mt-1 text-gray-600">
                  Preencha os dados para agendar um atendimento.
                </p>
              </div>
            </header>

            {/* Formulário */}
            <form
              onSubmit={salvarAgendamento}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <div className="flex flex-col gap-6 p-6 md:p-8">
                {erro && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100"
                  >
                    <span className="material-symbols-outlined text-xl">
                      error
                    </span>
                    {erro}
                  </div>
                )}

                {/* Paciente */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="paciente" className={rotulo}>
                    Paciente <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                      person
                    </span>
                    <select
                      id="paciente"
                      value={pacienteId}
                      onChange={(e) => setPacienteId(e.target.value)}
                      required
                      className={`${campo} appearance-none pl-11 pr-10`}
                    >
                      <option value="">Selecione um paciente</option>

                      {pacientes.map((paciente) => (
                        <option key={paciente.id} value={paciente.id}>
                          {paciente.nome_paciente} {paciente.sobrenome_paciente}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      expand_more
                    </span>
                  </div>

                  {pacientes.length === 0 && (
                    <p className="text-xs text-gray-500">
                      Nenhum paciente encontrado para sua conta.{" "}
                      <Link
                        to="/registro"
                        className="font-semibold text-primary-dark hover:underline"
                      >
                        Cadastrar paciente
                      </Link>
                    </p>
                  )}
                </div>

                {/* Tipo */}
                <div className="flex flex-col gap-2">
                  <span id="rotulo-tipo" className={rotulo}>
                    Tipo de atendimento <span className="text-red-500">*</span>
                  </span>

                  <div
                    role="radiogroup"
                    aria-labelledby="rotulo-tipo"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    {TIPOS.map((opcao) => {
                      const selecionado = tipo === opcao.valor;

                      return (
                        <button
                          key={opcao.valor}
                          type="button"
                          role="radio"
                          aria-checked={selecionado}
                          onClick={() => setTipo(opcao.valor)}
                          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                            selecionado
                              ? "border-primary bg-primary/10 ring-1 ring-primary"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              selecionado
                                ? "bg-primary text-white"
                                : "bg-primary/10 text-primary-dark"
                            }`}
                          >
                            <span className="material-symbols-outlined">
                              {opcao.icone}
                            </span>
                          </div>

                          <div className="flex-1">
                            <p className="font-bold text-gray-900">
                              {opcao.valor}
                            </p>
                            <p className="text-xs text-gray-500">
                              {opcao.descricao}
                            </p>
                          </div>

                          {selecionado && (
                            <span className="material-symbols-outlined text-primary-dark">
                              check_circle
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Data e horário */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="data" className={rotulo}>
                      Data <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="data"
                      type="date"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      required
                      className={campo}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="hora" className={rotulo}>
                      Horário <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                        schedule
                      </span>
                      <select
                        id="hora"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        required
                        className={`${campo} appearance-none pl-11 pr-10 tabular-nums`}
                      >
                        {HORARIOS.map((horario) => (
                          <option key={horario} value={horario}>
                            {horario}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Observação */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="observacao" className={rotulo}>
                    Observação{" "}
                    <span className="font-normal text-gray-400">
                      (opcional)
                    </span>
                  </label>

                  <textarea
                    id="observacao"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    rows={3}
                    placeholder="Ex.: sessão para dor lombar..."
                    className={`${campo} resize-y`}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end md:px-8 md:py-5">
                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => navigate("/agenda")}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando || pacientes.length === 0}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {salvando ? "progress_activity" : "calendar_check"}
                  </span>

                  {salvando ? "Salvando..." : "Salvar agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}