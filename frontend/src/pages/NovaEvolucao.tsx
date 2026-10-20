import Menu from "../components/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

interface ListaPacientes {
  nome_paciente: string;
  id: number;
}

interface AgendamentoDoPaciente {
  id: number;
  data_hora: string;
  tipo: string | null;
  evolucoes: { id: number }[];
}

type Feedback = { tipo: "sucesso" | "erro"; mensagem: string } | null;

export default function NovaEvolucao() {
  const location = useLocation();
  const navigate = useNavigate();
  const idPacienteRecebido = location.state?.idPaciente;

  const { IdUser } = useUser();
  const [listaPacientes, setListaPacientes] = useState<ListaPacientes[]>([]);
  const [evolucao, setEvolucao] = useState("");
  const [idPaciente, setIdPaciente] = useState<number>(idPacienteRecebido ?? 0);
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [listaAgendamentos, setListaAgendamentos] = useState<
    AgendamentoDoPaciente[]
  >([]);
  const [idAgendamento, setIdAgendamento] = useState<number>(
    location.state?.idAgendamento ?? 0,
  );
  const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(false);

  // Carrega os atendimentos já realizados do paciente que ainda não têm evolução
  useEffect(() => {
    if (!idPaciente) {
      setListaAgendamentos([]);
      return;
    }

    async function carregarAgendamentos() {
      setCarregandoAgendamentos(true);

      const { data, error } = await supabase
        .from("agendamentos")
        .select("id, data_hora, tipo, evolucoes(id)")
        .eq("paciente_id", idPaciente)
        .lte("data_hora", new Date().toISOString())
        .order("data_hora", { ascending: false });

      setCarregandoAgendamentos(false);

      if (error) {
        console.error("Erro ao carregar atendimentos:", error);
        setListaAgendamentos([]);
        return;
      }

      const semEvolucao = ((data ?? []) as AgendamentoDoPaciente[]).filter(
        (a) => !a.evolucoes || a.evolucoes.length === 0,
      );
      setListaAgendamentos(semEvolucao);
    }

    carregarAgendamentos();
  }, [idPaciente]);

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

  async function salvarEvolucao(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (salvando) return;

    if (!idPaciente || !idAgendamento || !evolucao.trim()) {
      setFeedback({
        tipo: "erro",
        mensagem:
          "Selecione o paciente, o atendimento e escreva a evolução.",
      });
      return;
    }

    setSalvando(true);
    setFeedback(null);

    const { error } = await supabase.from("evolucoes").insert({
      paciente_id: idPaciente,
      id_agendamento: idAgendamento,
      fisioterapeuta_id: IdUser,
      texto: evolucao.trim(),
    });

    setSalvando(false);

    if (error) {
      console.error("Erro ao salvar evolução:", error);
      setFeedback({
        tipo: "erro",
        mensagem: `Erro ao salvar: ${error.message}`,
      });
      return;
    }

    setFeedback({ tipo: "sucesso", mensagem: "Evolução salva com sucesso!" });
    setEvolucao("");
    setIdPaciente(0);
    setIdAgendamento(0);
  }

  const campo =
    "w-full rounded-xl border-none bg-gray-50 text-sm ring-1 ring-gray-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <Menu />
      <main className="relative flex h-full flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-64 w-full bg-gradient-to-b from-emerald-100/60 to-transparent"></div>
        <div className="z-10 flex-1 scroll-smooth overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8">
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
                to="/evolucoes"
                className="text-gray-500 transition-colors hover:text-primary-dark"
              >
                Evoluções
              </Link>
              <span className="material-symbols-outlined mx-1 text-base text-gray-400">
                chevron_right
              </span>
              <span className="font-semibold">Nova evolução</span>
            </nav>

            {/* Cabeçalho */}
            <header className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Nova evolução
              </h1>
              <p className="text-gray-600">
                Registre como foi a sessão e o progresso do paciente.
              </p>
            </header>

            {/* Formulário */}
            <form
              onSubmit={salvarEvolucao}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <div className="flex flex-col gap-6 p-6 md:p-8">
                {feedback && (
                  <div
                    role={feedback.tipo === "erro" ? "alert" : "status"}
                    className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium ring-1 ${
                      feedback.tipo === "sucesso"
                        ? "bg-primary/10 text-primary-dark ring-primary/20"
                        : "bg-red-50 text-red-600 ring-red-100"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {feedback.tipo === "sucesso" ? "check_circle" : "error"}
                    </span>
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                      <span>{feedback.mensagem}</span>
                      {feedback.tipo === "sucesso" && (
                        <Link
                          to="/evolucoes"
                          className="font-bold underline-offset-2 hover:underline"
                        >
                          Ver evoluções
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="paciente"
                    className="text-sm font-medium text-gray-700"
                  >
                    Paciente
                  </label>

                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                      person
                    </span>

                    <select
                      id="paciente"
                      value={idPaciente === 0 ? "" : String(idPaciente)}
                      onChange={(e) => {
                        const idSelecionado = Number(e.target.value);
                        setIdPaciente(idSelecionado);
                        setIdAgendamento(0);
                        setFeedback(null);
                      }}
                      className={`${campo} appearance-none py-3 pl-11 pr-10`}
                    >
                      <option value="" disabled>
                        Selecione um paciente...
                      </option>
                      {listaPacientes.map((paciente) => (
                        <option key={paciente.id} value={String(paciente.id)}>
                          {paciente.nome_paciente}
                        </option>
                      ))}
                    </select>

                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="atendimento"
                    className="text-sm font-medium text-gray-700"
                  >
                    Atendimento
                  </label>

                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                      event
                    </span>

                    <select
                      id="atendimento"
                      value={idAgendamento === 0 ? "" : String(idAgendamento)}
                      disabled={!idPaciente || listaAgendamentos.length === 0}
                      onChange={(e) => {
                        setIdAgendamento(Number(e.target.value));
                        setFeedback(null);
                      }}
                      className={`${campo} appearance-none py-3 pl-11 pr-10 disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <option value="" disabled>
                        {!idPaciente
                          ? "Selecione um paciente primeiro"
                          : carregandoAgendamentos
                            ? "Carregando atendimentos..."
                            : listaAgendamentos.length === 0
                              ? "Nenhum atendimento sem evolução"
                              : "Selecione o atendimento..."}
                      </option>
                      {listaAgendamentos.map((a) => (
                        <option key={a.id} value={String(a.id)}>
                          {new Date(a.data_hora).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {a.tipo ? ` • ${a.tipo}` : ""}
                        </option>
                      ))}
                    </select>

                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      expand_more
                    </span>
                  </div>

                  {idPaciente !== 0 &&
                    !carregandoAgendamentos &&
                    listaAgendamentos.length === 0 && (
                      <p className="text-xs text-gray-500">
                        Este paciente não tem atendimentos passados sem
                        evolução.{" "}
                        <Link
                          to="/novoagendamento"
                          className="font-semibold text-primary-dark hover:underline"
                        >
                          Criar agendamento
                        </Link>
                      </p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="evolucao"
                      className="text-sm font-medium text-gray-700"
                    >
                      Evolução
                    </label>
                    <span className="text-xs tabular-nums text-gray-400">
                      {evolucao.length} caracteres
                    </span>
                  </div>
                  <textarea
                    id="evolucao"
                    value={evolucao}
                    onChange={(e) => {
                      setEvolucao(e.target.value);
                      setFeedback(null);
                    }}
                    className={`${campo} resize-y p-4 placeholder-gray-400`}
                    placeholder="Descreva a evolução do paciente..."
                    rows={8}
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center md:px-8 md:py-5">
                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => navigate("/evolucoes")}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {salvando ? "progress_activity" : "check"}
                  </span>
                  {salvando ? "Salvando..." : "Salvar evolução"}
                </button>
              </div>
            </form>

            <div className="flex justify-center pb-4">
              <p className="text-center text-xs text-gray-500">
                Informações confidenciais do paciente.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}