import Menu from "../components/Menu";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface Pendencia {
  id: number;
  data_hora: string;
  tipo: string | null;
  observacao: string | null;
  evolucoes: { id: number }[];
  pacientes: {
    id: number;
    nome_paciente: string | null;
    sobrenome_paciente: string | null;
  } | null;
}

type Ordem = "recentes" | "antigas";

function iniciais(nome?: string | null, sobrenome?: string | null) {
  const a = nome?.trim()?.[0] ?? "";
  const b = sobrenome?.trim()?.[0] ?? nome?.trim()?.[1] ?? "";
  return (a + b).toUpperCase() || "?";
}

function diasDesde(dataIso: string) {
  const ms = Date.now() - new Date(dataIso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function textoAtraso(dias: number) {
  if (dias === 0) return "Hoje";
  if (dias === 1) return "Há 1 dia";
  return `Há ${dias} dias`;
}

export default function EvolucoesPendentes() {
  const { IdUser } = useUser();
  const navigate = useNavigate();

  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState<Ordem>("antigas");

  useEffect(() => {
    if (!IdUser) return;

    async function carregar() {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from("agendamentos")
        .select(
          `
          id,
          data_hora,
          tipo,
          observacao,
          evolucoes ( id ),
          pacientes!inner ( id, nome_paciente, sobrenome_paciente, id_user )
        `,
        )
        .eq("pacientes.id_user", IdUser)
        .eq("status", "Atendido")
        .lte("data_hora", new Date().toISOString())
        .order("data_hora", { ascending: true });

      if (error) {
        console.error(error);
        setErro("Não foi possível carregar as evoluções pendentes.");
        setCarregando(false);
        return;
      }

      // Pendente = atendimento já realizado e sem nenhuma evolução registrada
      const semEvolucao = ((data ?? []) as unknown as Pendencia[]).filter(
        (a) => !a.evolucoes || a.evolucoes.length === 0,
      );

      setPendencias(semEvolucao);
      setCarregando(false);
    }

    carregar();
  }, [IdUser]);

  const visiveis = useMemo(() => {
    const termo = filtro.trim().toLowerCase();

    const filtradas = pendencias.filter((p) => {
      if (!termo) return true;
      const nome = [p.pacientes?.nome_paciente, p.pacientes?.sobrenome_paciente]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return nome.includes(termo);
    });

    return [...filtradas].sort((a, b) => {
      const diff =
        new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime();
      return ordem === "antigas" ? diff : -diff;
    });
  }, [pendencias, filtro, ordem]);

  const maisAntiga = pendencias[0] ? diasDesde(pendencias[0].data_hora) : 0;
  const pacientesDistintos = new Set(
    pendencias.map((p) => p.pacientes?.id).filter(Boolean),
  ).size;

  function completarNota(p: Pendencia) {
  if (!p.pacientes) return;
  navigate("/novaevolucao", {
    state: {
      idPaciente: p.pacientes.id,
      idAgendamento: p.id,
    },
  });
}

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Menu />
      <main className="flex flex-1 flex-col overflow-y-auto bg-primary/10">
        {/* Header */}
        <header className="sticky top-0 z-10 flex w-full items-center justify-between gap-4 border-b border-green-100 bg-white/80 px-8 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              aria-label="Voltar ao painel"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col leading-tight">
              <h2 className="text-lg font-bold tracking-tight">
                Evoluções pendentes
              </h2>
              <p className="text-sm text-gray-500">
                Sessões atendidas sem anotação
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 md:p-8">
          {/* Resumo */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <span className="material-symbols-outlined">edit_note</span>
              </div>
              <div>
                <p className="text-3xl font-bold tabular-nums">
                  {pendencias.length}
                </p>
                <p className="text-sm text-gray-600">
                  {pendencias.length === 1
                    ? "nota pendente"
                    : "notas pendentes"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <span className="material-symbols-outlined">diversity_1</span>
              </div>
              <div>
                <p className="text-3xl font-bold tabular-nums">
                  {pacientesDistintos}
                </p>
                <p className="text-sm text-gray-600">
                  {pacientesDistintos === 1
                    ? "paciente envolvido"
                    : "pacientes envolvidos"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div>
                <p className="text-3xl font-bold tabular-nums">{maisAntiga}</p>
                <p className="text-sm text-gray-600">
                  {maisAntiga === 1 ? "dia, a mais antiga" : "dias, a mais antiga"}
                </p>
              </div>
            </div>
          </div>

          {/* Lista */}
          <section className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  search
                </span>
                <input
                  type="text"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  placeholder="Filtrar por paciente..."
                  className="h-10 w-full rounded-xl border border-transparent bg-gray-50 pl-10 pr-4 text-sm placeholder-gray-400 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div
                role="group"
                aria-label="Ordenar por"
                className="flex rounded-xl bg-gray-50 p-1 text-sm font-medium"
              >
                {(
                  [
                    ["antigas", "Mais antigas"],
                    ["recentes", "Mais recentes"],
                  ] as [Ordem, string][]
                ).map(([valor, rotulo]) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setOrdem(valor)}
                    aria-pressed={ordem === valor}
                    className={`rounded-lg px-3 py-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      ordem === valor
                        ? "bg-white text-primary-dark shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {rotulo}
                  </button>
                ))}
              </div>
            </div>

            {carregando ? (
              <p className="py-10 text-center text-sm text-gray-500">
                Carregando...
              </p>
            ) : erro ? (
              <div className="flex flex-col items-center gap-2 rounded-xl bg-red-50 px-4 py-8 text-center">
                <span className="material-symbols-outlined text-red-500">
                  error
                </span>
                <p className="text-sm font-medium text-red-600">{erro}</p>
              </div>
            ) : visiveis.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                  <span className="material-symbols-outlined">task_alt</span>
                </div>
                <p className="font-semibold">
                  {pendencias.length === 0
                    ? "Nenhuma nota pendente"
                    : "Nenhum resultado para o filtro"}
                </p>
                <p className="max-w-xs text-sm text-gray-500">
                  {pendencias.length === 0
                    ? "Quando você atender um paciente sem registrar a evolução, ele aparece aqui."
                    : "Tente buscar por outro nome."}
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {visiveis.map((p) => {
                  const dias = diasDesde(p.data_hora);
                  const urgente = dias >= 7;
                  const nome = [
                    p.pacientes?.nome_paciente,
                    p.pacientes?.sobrenome_paciente,
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const detalhes = [p.tipo, p.observacao]
                    .filter(Boolean)
                    .join(" • ");

                  return (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4 transition hover:border-amber-200"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
                          {iniciais(
                            p.pacientes?.nome_paciente,
                            p.pacientes?.sobrenome_paciente,
                          )}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="truncate font-bold">
                              {nome || "Paciente sem nome"}
                            </h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                urgente
                                  ? "bg-red-100 text-red-600"
                                  : "bg-amber-100 text-amber-600"
                              }`}
                            >
                              {textoAtraso(dias)}
                            </span>
                          </div>
                          <p className="truncate text-sm text-gray-500">
                            {new Date(p.data_hora).toLocaleString("pt-BR", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {detalhes && ` • ${detalhes}`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => completarNota(p)}
                        className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-bold text-primary-dark shadow-sm ring-1 ring-black/5 transition hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        Completar nota
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}