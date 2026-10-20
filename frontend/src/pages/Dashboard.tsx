import Menu from "../components/Menu";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import type { Agendamento } from "../types/types";
import { useUser } from "../context/UserContext";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface AgendamentoPendente {
  id: number;
  data_hora: string;
  status: string | null;
  evolucoes: {
    id: number;
  }[];
}

interface Pacientes {
  id: number;
  nome_paciente: string | null;
  sobrenome_paciente: string | null;
  telefone: string | null;
  email: string | null;
  agendamentos: AgendamentoPendente[];
}

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function iniciais(nome?: string | null, sobrenome?: string | null) {
  const a = nome?.trim()?.[0] ?? "";
  const b = sobrenome?.trim()?.[0] ?? nome?.trim()?.[1] ?? "";
  return (a + b).toUpperCase() || "?";
}

export default function Dashboard() {
  const { titulo, sobrenome, IdUser } = useUser();

  const hoje = new Date();
  const dia = hoje.getDate();
  const mesNum = hoje.getMonth();
  const ano = hoje.getFullYear();
  const hora = hoje.getHours();
  const mes = MESES[mesNum];
  const diaSemana = hoje.toLocaleDateString("pt-BR", { weekday: "long" });
  const diaSemanaCapitalizado =
    diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  // Inicio da semana
  const inicioSemana = new Date(hoje);
  const primerDia = inicioSemana.getDay();
  const diferenca = primerDia === 0 ? 6 : primerDia - 1;
  inicioSemana.setDate(inicioSemana.getDate() - diferenca);
  inicioSemana.setHours(0, 0, 0, 0);

  // Fim da semana
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(fimSemana.getDate() + 6);
  fimSemana.setHours(23, 59, 59, 999);

  // Semana passada
  const inicioSemanaPassada = new Date(inicioSemana);
  inicioSemanaPassada.setDate(inicioSemanaPassada.getDate() - 7);

  const fimSemanaPassada = new Date(fimSemana);
  fimSemanaPassada.setDate(fimSemanaPassada.getDate() - 7);

  let saudacao;
  if (hora < 12) {
    saudacao = "Bom dia";
  } else if (hora < 18) {
    saudacao = "Boa tarde";
  } else {
    saudacao = "Boa noite";
  }

  const [atendimentosHoje, setAtendimentosHoje] = useState(0);
  const [agendamentosHoje, setAgendamentosHoje] = useState<Agendamento[]>([]);
  const [comparacao, setComparacao] = useState("");
  const [tendenciaAtendimentos, setTendenciaAtendimentos] = useState<
    "up" | "down" | "flat"
  >("flat");
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [ComparacaoPacientes, setComparacaoPacientes] = useState("");
  const [listaPacientes, setListaPacientes] = useState<Pacientes[]>([]);
  const [evolucoesDoDia, setEvolucoesDoDia] = useState(0);

  useEffect(() => {
    if (!IdUser) return;

    async function carregarDados() {
      const inicioHoje = new Date();
      inicioHoje.setHours(0, 0, 0, 0);

      const fimHoje = new Date();
      fimHoje.setHours(23, 59, 59, 999);

      const ontemInicio = new Date(inicioHoje);
      ontemInicio.setDate(ontemInicio.getDate() - 1);

      const ontemFim = new Date(fimHoje);
      ontemFim.setDate(ontemFim.getDate() - 1);

      const { count: hojeCount } = await supabase
        .from("agendamentos")
        .select("*", { count: "exact", head: true })
        .gte("data_hora", inicioHoje.toISOString())
        .lte("data_hora", fimHoje.toISOString());

      const { count: ontemCount } = await supabase
        .from("agendamentos")
        .select("*", { count: "exact", head: true })
        .gte("data_hora", ontemInicio.toISOString())
        .lte("data_hora", ontemFim.toISOString());

      const totalHoje = hojeCount || 0;
      const totalOntem = ontemCount || 0;

      if (totalHoje > totalOntem) {
        setComparacao(`${totalHoje - totalOntem} a mais que ontem`);
        setTendenciaAtendimentos("up");
      } else if (totalHoje < totalOntem) {
        setComparacao(`${totalOntem - totalHoje} a menos que ontem`);
        setTendenciaAtendimentos("down");
      } else {
        setComparacao("Mesmo número de atendimentos que ontem");
        setTendenciaAtendimentos("flat");
      }

      const { data, error } = await supabase
        .from("agendamentos")
        .select("*,pacientes(nome_paciente,sobrenome_paciente)")
        .gte("data_hora", inicioHoje.toISOString())
        .lte("data_hora", fimHoje.toISOString())
        .order("data_hora", { ascending: true });

      const { count: pacientesCount, error: pacientesError } = await supabase
        .from("pacientes")
        .select("*", { count: "exact", head: true })
        .eq("id_user", IdUser);

      if (pacientesError) {
        console.error(pacientesError);
        return;
      }
      setTotalPacientes(pacientesCount || 0);

      const { count: estaSemana } = await supabase
        .from("pacientes")
        .select("*", { count: "exact", head: true })
        .gte("created_at", inicioSemana.toISOString())
        .lte("created_at", fimSemana.toISOString());

      const { count: semanaPassada } = await supabase
        .from("pacientes")
        .select("*", { count: "exact", head: true })
        .gte("created_at", inicioSemanaPassada.toISOString())
        .lte("created_at", fimSemanaPassada.toISOString());

      const atual = estaSemana || 0;
      const anterior = semanaPassada || 0;

      if (atual > anterior) {
        setComparacaoPacientes(`+${atual - anterior} novos esta semana`);
      } else if (atual < anterior) {
        setComparacaoPacientes(
          `${anterior - atual} a menos que na semana passada`,
        );
      } else {
        setComparacaoPacientes(
          "Mesmo número de novos pacientes da semana passada",
        );
      }

      if (error) {
        console.error(error);
        return;
      }
      setAtendimentosHoje(totalHoje);
      setAgendamentosHoje(data || []);

      const {
        data: dadosLista,
        error: dadosError,
        count: contagem,
      } = await supabase
        .from("pacientes")
        .select(
          `
    id,
    nome_paciente,
    sobrenome_paciente,
    telefone,
    email,
    agendamentos!inner (
      id,
      data_hora,
      status,
      evolucoes (
        id
      )
    )
  `,
          { count: "exact" },
        )
        .eq("id_user", IdUser)
        .eq("agendamentos.status", "Atendido")
        .lte("agendamentos.data_hora", new Date().toISOString());

      if (dadosError) {
        console.error("Erro ao buscar pacientes:", dadosError);
      } else {
        setListaPacientes((dadosLista ?? []) as Pacientes[]);
        setEvolucoesDoDia(contagem || 0);
      }
    }

    carregarDados();
  }, [IdUser]);

  // Índice do próximo atendimento de hoje (primeiro que ainda não passou)
  const agora = new Date();
  const indiceProximo = agendamentosHoje.findIndex(
    (a) => new Date(a.data_hora) >= agora,
  );

  const resumoDia =
    atendimentosHoje === 0
      ? "Você não tem atendimentos agendados para hoje."
      : atendimentosHoje === 1
        ? "Você tem 1 atendimento hoje."
        : `Você tem ${atendimentosHoje} atendimentos hoje.`;

  const iconeTendencia =
    tendenciaAtendimentos === "up"
      ? "trending_up"
      : tendenciaAtendimentos === "down"
        ? "trending_down"
        : "trending_flat";

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Menu />
      <main className="flex flex-1 flex-col overflow-y-auto bg-primary/10">
        {/* Header */}
        <header className="sticky top-0 z-10 flex w-full items-center justify-between gap-4 border-b border-green-100 bg-white/80 px-8 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
              <span className="material-symbols-outlined">calendar_today</span>
            </div>
            <div className="flex flex-col leading-tight">
              <h2 className="text-lg font-bold tracking-tight">
                {dia} de {mes}, {ano}
              </h2>
              <p className="text-sm text-gray-500">{diaSemanaCapitalizado}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden w-80 md:block">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                className="h-10 w-full rounded-xl border border-transparent bg-gray-50 pl-10 pr-4 text-sm placeholder-gray-400 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/30"
                type="text"
                placeholder="Buscar pacientes, condições..."
              />
            </div>
            <button
              aria-label="Notificações"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition hover:bg-gray-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 md:p-8">
          {/* Saudação */}
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {saudacao}, {titulo} {sobrenome}
            </h2>
            <p className="text-gray-600">{resumoDia}</p>
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Atendimentos hoje */}
            <div className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                  <span className="material-symbols-outlined">
                    event_available
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Atendimentos hoje
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-5xl font-bold tabular-nums">
                  {atendimentosHoje}
                </h3>
                <p className="flex items-center gap-1.5 text-xs font-medium text-primary-dark">
                  <span className="material-symbols-outlined text-base">
                    {iconeTendencia}
                  </span>
                  {comparacao}
                </p>
              </div>
            </div>

            {/* Evoluções pendentes */}
            <div className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  <span className="material-symbols-outlined">edit_note</span>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Evoluções pendentes
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-5xl font-bold tabular-nums">
                  {evolucoesDoDia}
                </h3>
                <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                  <span className="material-symbols-outlined text-base">
                    {evolucoesDoDia > 0 ? "priority_high" : "check_circle"}
                  </span>
                  {evolucoesDoDia > 0 ? "Ação necessária" : "Tudo em dia"}
                </p>
              </div>
            </div>

            {/* Total de pacientes */}
            <div className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <span className="material-symbols-outlined">diversity_1</span>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Total de pacientes
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-5xl font-bold tabular-nums">
                  {totalPacientes}
                </h3>
                <p className="flex items-center gap-1.5 text-xs font-medium text-blue-600">
                  <span className="material-symbols-outlined text-base">
                    group_add
                  </span>
                  {ComparacaoPacientes}
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Agenda de hoje */}
            <section className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Agenda de hoje</h3>
                  <p className="text-sm text-gray-500">
                    {agendamentosHoje.length === 0
                      ? "Sem horários marcados"
                      : `${agendamentosHoje.length} ${
                          agendamentosHoje.length === 1
                            ? "horário marcado"
                            : "horários marcados"
                        }`}
                  </p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2">
                  <span className="material-symbols-outlined text-lg">add</span>
                  Novo atendimento
                </button>
              </div>

              {agendamentosHoje.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                    <span className="material-symbols-outlined">
                      event_available
                    </span>
                  </div>
                  <p className="font-semibold">Nenhum atendimento hoje</p>
                  <p className="max-w-xs text-sm text-gray-500">
                    Quando você marcar um horário, ele aparece aqui.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {agendamentosHoje.map((agendamento, i) => {
                    const passou = new Date(agendamento.data_hora) < agora;
                    const ehProximo = i === indiceProximo;
                    const nomeCompleto = [
                      agendamento.pacientes?.nome_paciente,
                      agendamento.pacientes?.sobrenome_paciente,
                    ]
                      .filter(Boolean)
                      .join(" ");
                    const detalhes = [
                      agendamento.tipo,
                      agendamento.observacao,
                    ]
                      .filter(Boolean)
                      .join(" • ");

                    return (
                      <div
                        key={agendamento.id}
                        className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition ${
                          ehProximo
                            ? "border-primary/40 bg-primary/5 shadow-sm"
                            : "border-gray-100 hover:border-primary/30 hover:bg-primary/5"
                        } ${passou ? "opacity-60" : ""}`}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`flex w-20 shrink-0 flex-col items-center justify-center rounded-xl px-3 py-2 ${
                              ehProximo
                                ? "bg-primary text-white"
                                : "bg-primary/10 text-primary-dark"
                            }`}
                          >
                            <p className="text-lg font-bold tabular-nums">
                              {new Date(
                                agendamento.data_hora,
                              ).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          <div className="flex min-w-0 flex-col">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="truncate font-bold">
                                {nomeCompleto || "Paciente sem nome"}
                              </h4>
                              {ehProximo && (
                                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary-dark">
                                  Próximo
                                </span>
                              )}
                              {passou && (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                  Concluído
                                </span>
                              )}
                            </div>
                            {detalhes && (
                              <p className="truncate text-sm text-gray-500">
                                {detalhes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="hidden shrink-0 items-center gap-3 sm:flex">
                          <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                            Ver detalhes
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Evoluções pendentes */}
            <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Evoluções pendentes</h3>
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-amber-100 px-2 text-xs font-bold text-amber-600">
                  {evolucoesDoDia}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Anotações das sessões anteriores que precisam ser concluídas.
              </p>

              <div className="flex flex-col gap-3">
                {listaPacientes.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-gray-50/60 px-4 py-8 text-center">
                    <span className="material-symbols-outlined text-primary-dark">
                      task_alt
                    </span>
                    <p className="text-sm font-medium">Nenhuma nota pendente</p>
                  </div>
                ) : (
                  listaPacientes.map((paciente) => (
                    <div
                      key={paciente.id}
                      className="flex flex-col gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-4 transition hover:border-amber-200"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
                            {iniciais(
                              paciente.nome_paciente,
                              paciente.sobrenome_paciente,
                            )}
                          </div>
                          <p className="truncate font-medium">
                            {[
                              paciente.nome_paciente,
                              paciente.sobrenome_paciente,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          </p>
                        </div>
                        <p className="shrink-0 text-xs text-gray-500">
                          {paciente.agendamentos?.[0]?.data_hora
                            ? new Date(
                                paciente.agendamentos[0].data_hora,
                              ).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Data indisponível"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-black/5">
                          Acompanhamento
                        </p>
                        <button className="flex items-center gap-1 text-xs font-bold text-primary-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                          Completar nota
                          <span className="material-symbols-outlined text-sm">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button className="mt-2 w-full rounded-xl border border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-600 transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                Ver todas as tarefas pendentes
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}