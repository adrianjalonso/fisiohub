import Menu from "../components/Menu";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

interface Pacientes {
  id: number;
  nome_paciente: string;
  sobrenome_paciente: string;
  id_user: number;
}

interface Agendamentos {
  id: number;
  paciente_id: number;
  data_hora: string;
  tipo: string;
  status: string;
  observacao: string;
  pacientes: Pacientes | null;
}

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

function formatarChaveDia(data: Date) {
  return (
    data.getFullYear() +
    "-" +
    String(data.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(data.getDate()).padStart(2, "0")
  );
}

function horaDoAgendamento(dataHora: string) {
  return dataHora.split("T")[1]?.substring(0, 5) ?? "";
}

function nomeDoPaciente(a: Agendamentos) {
  return a.pacientes
    ? `${a.pacientes.nome_paciente} ${a.pacientes.sobrenome_paciente}`
    : "Paciente desconhecido";
}

export default function Agenda() {
  const hoje = new Date();

  const { IdUser } = useUser();
  const [agendamentos, setAgendamentos] = useState<Agendamentos[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(hoje);

  const dataDePesquisa = formatarChaveDia(dataSelecionada);
  const ehHoje = dataDePesquisa === formatarChaveDia(hoje);
  const horaAtual = String(hoje.getHours()).padStart(2, "0");

  const agendamentosDoDia = agendamentos
    .filter((agendamento) => {
      const dataDoAgendamento = agendamento.data_hora.split("T")[0];
      return dataDoAgendamento === dataDePesquisa;
    })
    .sort((a, b) => a.data_hora.localeCompare(b.data_hora));

  useEffect(() => {
    async function carregarAgenda() {
      const { data, error } = await supabase
        .from("agendamentos")
        .select(
          `id,paciente_id,data_hora,tipo,status,observacao,pacientes!inner(id,nome_paciente,sobrenome_paciente,id_user)`,
        )
        .eq("pacientes.id_user", IdUser);

      if (error) {
        console.log(error);
        return;
      }

      const dadosFormatados = data.map((item: any) => ({
        ...item,
        pacientes: Array.isArray(item.pacientes)
          ? item.pacientes[0]
          : item.pacientes,
      }));

      setAgendamentos(dadosFormatados);
    }

    carregarAgenda();
  }, [IdUser]);

  function mudarDia(delta: number) {
    const novaData = new Date(dataSelecionada);
    novaData.setDate(novaData.getDate() + delta);
    setDataSelecionada(novaData);
  }

  const diaSemana = dataSelecionada.toLocaleDateString("pt-BR", {
    weekday: "long",
  });
  const diaSemanaCapitalizado =
    diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  const botaoNavegar =
    "flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

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
              <span className="font-semibold">Agenda</span>
            </nav>

            {/* Cabeçalho */}
            <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Agenda
                </h2>
                <p className="max-w-xl text-gray-600">
                  Gerencie seus horários e atendimentos.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-black/5">
                  <button
                    aria-pressed="true"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  >
                    Dia
                  </button>
                  <button
                    disabled
                    title="Em breve"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400"
                  >
                    Semana
                  </button>
                  <button
                    disabled
                    title="Em breve"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400"
                  >
                    Mês
                  </button>
                </div>

                <Link
                  to={"/novoagendamento"}
                  className="flex min-w-[180px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark hover:shadow-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 md:flex-none"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                  Novo agendamento
                </Link>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:h-[calc(100vh-16rem)] lg:min-h-[520px] lg:grid-cols-12">
              {/* Linha do tempo do dia */}
              <section className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 lg:col-span-8 lg:min-h-0 xl:col-span-9">
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Dia anterior"
                      onClick={() => mudarDia(-1)}
                      className={botaoNavegar}
                    >
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </button>

                    <div className="flex min-w-[200px] flex-col text-center leading-tight">
                      <h3 className="text-lg font-bold">
                        {dataSelecionada.toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {diaSemanaCapitalizado}
                      </p>
                    </div>

                    <button
                      aria-label="Próximo dia"
                      onClick={() => mudarDia(1)}
                      className={botaoNavegar}
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => setDataSelecionada(new Date(hoje))}
                    disabled={ehHoje}
                    className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-default disabled:bg-transparent disabled:text-gray-400"
                  >
                    Hoje
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  {HORARIOS.map((hora) => {
                    // Agrupa pela hora cheia para não esconder atendimentos como 08:30
                    const agendamentosDaHora = agendamentosDoDia.filter(
                      (a) => horaDoAgendamento(a.data_hora).substring(0, 2) === hora.substring(0, 2),
                    );
                    const horaAgora = ehHoje && hora.substring(0, 2) === horaAtual;

                    return (
                      <div
                        key={hora}
                        className={`flex min-h-24 border-t border-gray-100 ${
                          horaAgora ? "bg-primary/5" : ""
                        }`}
                      >
                        <div
                          className={`w-16 shrink-0 pt-3 text-xs tabular-nums ${
                            horaAgora
                              ? "font-bold text-primary-dark"
                              : "font-medium text-gray-400"
                          }`}
                        >
                          {hora}
                        </div>

                        <div className="flex flex-1 flex-col gap-2 border-l border-gray-100 p-2">
                          {agendamentosDaHora.map((agendamento) => {
                            const isCancelado =
                              agendamento.status === "Cancelado";

                            return (
                              <div
                                key={agendamento.id}
                                className={`flex cursor-pointer flex-col justify-center gap-1 rounded-xl border-l-4 px-4 py-3 transition-shadow hover:shadow-md ${
                                  isCancelado
                                    ? "border-gray-300 bg-gray-100 opacity-60"
                                    : "border-primary bg-primary/10"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex min-w-0 items-baseline gap-2">
                                    <span
                                      className={`text-xs font-semibold tabular-nums ${
                                        isCancelado
                                          ? "text-gray-400"
                                          : "text-primary-dark"
                                      }`}
                                    >
                                      {horaDoAgendamento(agendamento.data_hora)}
                                    </span>
                                    <span
                                      className={`truncate font-bold ${
                                        isCancelado
                                          ? "text-gray-400 line-through"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {nomeDoPaciente(agendamento)}
                                    </span>
                                  </div>

                                  <span
                                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      isCancelado
                                        ? "bg-red-50 text-red-400"
                                        : "bg-white text-primary-dark ring-1 ring-primary/20"
                                    }`}
                                  >
                                    {agendamento.tipo}
                                  </span>
                                </div>

                                <span
                                  className={`truncate text-sm ${
                                    isCancelado
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {agendamento.observacao || agendamento.status}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Resumo do dia */}
              <section className="flex min-h-[320px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 lg:col-span-4 lg:min-h-0 xl:col-span-3">
                <div className="flex items-center justify-between border-b border-gray-100 p-4">
                  <div>
                    <h3 className="font-bold">Resumo do dia</h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {agendamentosDoDia.length === 1
                        ? "1 agendamento"
                        : `${agendamentosDoDia.length} agendamentos`}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                    <span className="material-symbols-outlined">
                      event_available
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                  {agendamentosDoDia.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <span className="material-symbols-outlined text-3xl text-gray-300">
                        event_busy
                      </span>
                      <p className="text-sm font-medium text-gray-600">
                        Dia livre
                      </p>
                      <p className="max-w-[200px] text-sm text-gray-400">
                        Nenhum agendamento para este dia.
                      </p>
                    </div>
                  ) : (
                    agendamentosDoDia.map((agendamento) => {
                      const isCancelado = agendamento.status === "Cancelado";

                      return (
                        <div
                          key={agendamento.id}
                          className={`flex gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 transition-colors hover:bg-primary/5 ${
                            isCancelado ? "opacity-60" : ""
                          }`}
                        >
                          <div className="flex min-w-[44px] flex-col items-center">
                            <span className="text-sm font-bold tabular-nums text-gray-700">
                              {horaDoAgendamento(agendamento.data_hora)}
                            </span>
                            <div
                              className={`mt-1.5 h-2 w-2 rounded-full ${
                                isCancelado ? "bg-gray-300" : "bg-primary"
                              }`}
                            ></div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4
                              className={`truncate text-sm font-bold ${
                                isCancelado
                                  ? "text-gray-400 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {nomeDoPaciente(agendamento)}
                            </h4>

                            <p className="truncate text-sm text-gray-500">
                              {agendamento.tipo}
                            </p>

                            <span
                              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                isCancelado
                                  ? "bg-red-50 text-red-400"
                                  : "bg-primary/10 text-primary-dark"
                              }`}
                            >
                              {agendamento.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}