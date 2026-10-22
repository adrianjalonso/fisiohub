import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";

interface PacienteFicha {
  id: number;
  nome_paciente: string | null;
  sobrenome_paciente: string | null;
  data_nascimento: string | null;
  genero: string | null;
  email: string | null;
  telefone: string | number | null;
  endereco: string | null;
  status: string | null;
  idade: number | null;
}

interface Evolucao {
  id: number | string;
  patologia: string | null;
  texto: string | null;
  created_at: string;
}

interface FormDados {
  nome: string;
  sobrenome: string;
  nascimento: string;
  genero: string;
  email: string;
  telefone: string;
  endereco: string;
}

type Feedback = { tipo: "sucesso" | "erro"; mensagem: string } | null;

const EVOLUCOES_VISIVEIS = 3;

// Aceita qualquer tipo: se a coluna for numérica, o Supabase devolve number
function formatarTelefone(entrada: unknown) {
  const valor = String(entrada ?? "")
    .replace(/\D/g, "")
    .slice(0, 11);
  if (valor.length <= 2) return valor;
  if (valor.length <= 7) return `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  return `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
}

function calcularIdade(dataDeNascimento: string | null) {
  if (!dataDeNascimento) return null;
  const hoje = new Date();
  const nascimento = new Date(dataDeNascimento);
  if (Number.isNaN(nascimento.getTime())) return null;

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();

  if (
    mesAtual < mesNascimento ||
    (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
  ) {
    idade--;
  }
  return idade;
}

function hojeParaInput() {
  const hoje = new Date();
  return (
    hoje.getFullYear() +
    "-" +
    String(hoje.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(hoje.getDate()).padStart(2, "0")
  );
}

function Dado({
  icone,
  rotulo,
  valor,
}: {
  icone: string;
  rotulo: string;
  valor: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
        <span className="material-symbols-outlined text-xl">{icone}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{rotulo}</p>
        <p className="break-words text-sm font-medium text-gray-900">
          {valor || <span className="text-gray-400">Não informado</span>}
        </p>
      </div>
    </div>
  );
}

interface EvolucaoExport {
  id: number | string;
  patologia: string | null;
  texto: string | null;
  created_at: string;
  data_atendimento: string;
  tipo: string | null;
}

function esc(valor: unknown) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const FORMATO_DATA_HORA: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

function montarDocumento(
  p: PacienteFicha,
  itens: EvolucaoExport[],
  profissional: string,
) {
  const nome =
    [p.nome_paciente, p.sobrenome_paciente].filter(Boolean).join(" ") ||
    "Paciente";
  const idade = calcularIdade(p.data_nascimento);
  const nascimento = p.data_nascimento
    ? new Date(p.data_nascimento).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      })
    : "";
  const emitido = new Date().toLocaleString("pt-BR", FORMATO_DATA_HORA);

  const dados: [string, string][] = (
    [
      ["Prontuário", `#${p.id}`],
      ["Nascimento", nascimento ? `${nascimento}${idade !== null ? ` (${idade} anos)` : ""}` : ""],
      ["Gênero", p.genero ?? ""],
      ["Telefone", p.telefone ? formatarTelefone(p.telefone) : ""],
      ["E-mail", p.email ?? ""],
      ["Endereço", p.endereco ?? ""],
      ["Situação", p.status ?? ""],
    ] as [string, string][]
  ).filter(([, valor]) => valor);

  const blocoDados = dados
    .map(
      ([r, v]) =>
        `<div class="dado"><span>${esc(r)}</span><strong>${esc(v)}</strong></div>`,
    )
    .join("");

  const blocoEvolucoes = itens
    .map((e) => {
      const subtitulo = [e.tipo, e.patologia].filter(Boolean).join(" • ");
      return `
      <article class="evo">
        <header>
          <h3>${esc(
            new Date(e.data_atendimento).toLocaleString("pt-BR", FORMATO_DATA_HORA),
          )}</h3>
          ${subtitulo ? `<span>${esc(subtitulo)}</span>` : ""}
        </header>
        <p class="texto">${esc(e.texto || "Sem descrição.")}</p>
        <p class="meta">Registrada em ${esc(
          new Date(e.created_at).toLocaleString("pt-BR", FORMATO_DATA_HORA),
        )}</p>
      </article>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Prontuário - ${esc(nome)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Segoe UI", Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1f2937; }
  .topo { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #059669; padding-bottom: 10px; }
  .topo h1 { margin: 0; font-size: 20pt; }
  .topo p { margin: 0; font-size: 9pt; color: #6b7280; text-align: right; }
  h2 { font-size: 12pt; margin: 22px 0 8px; color: #047857; }
  .dados { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
  .dado span { display: block; font-size: 8.5pt; color: #6b7280; }
  .dado strong { font-weight: 600; font-size: 10.5pt; }
  .evo { break-inside: avoid; border-left: 3px solid #059669; background: #f3faf6; padding: 8px 12px; margin-bottom: 12px; }
  .evo header { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .evo h3 { margin: 0; font-size: 11pt; }
  .evo header span { font-size: 9.5pt; color: #047857; }
  .texto { margin: 6px 0 4px; white-space: pre-wrap; }
  .meta { margin: 0; font-size: 8.5pt; color: #6b7280; }
  .assinatura { break-inside: avoid; margin-top: 48px; text-align: center; }
  .assinatura div { width: 260px; margin: 0 auto 4px; border-top: 1px solid #374151; }
  .rodape { margin-top: 24px; font-size: 8.5pt; color: #6b7280; text-align: center; }
</style>
</head>
<body>
  <div class="topo">
    <h1>Prontuário do paciente</h1>
    <p>FisioHub<br />Emitido em ${esc(emitido)}</p>
  </div>

  <h2>${esc(nome)}</h2>
  <div class="dados">${blocoDados}</div>

  <h2>Evoluções (${itens.length})</h2>
  ${blocoEvolucoes}

  <div class="assinatura">
    <div></div>
    <p>${esc(profissional || "Fisioterapeuta responsável")}</p>
  </div>
  <p class="rodape">Documento confidencial. Contém informações sensíveis do paciente.</p>
</body>
</html>`;
}

function imprimirHtml(html: string, tituloArquivo: string) {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.appendChild(iframe);

  const janela = iframe.contentWindow;
  if (!janela) {
    iframe.remove();
    return false;
  }

  janela.document.open();
  janela.document.write(html);
  janela.document.close();

  // O navegador usa o título da página como nome sugerido do PDF
  const tituloOriginal = document.title;
  document.title = tituloArquivo;
  janela.onafterprint = () => {
    document.title = tituloOriginal;
    iframe.remove();
  };

  setTimeout(() => {
    janela.focus();
    janela.print();
  }, 250);

  return true;
}

export default function FichaPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { IdUser, titulo, sobrenome: sobrenomeUser } = useUser();

  const [paciente, setPaciente] = useState<PacienteFicha | null>(null);
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erroCarregar, setErroCarregar] = useState<string | null>(null);

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<FormDados | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    if (!id || !IdUser) return;

    async function carregarFicha() {
      setLoading(true);
      setErroCarregar(null);

      const { data: dadosPaciente, error: erroPaciente } = await supabase
        .from("pacientes")
        .select(
          "id, nome_paciente, sobrenome_paciente, data_nascimento, genero, email, telefone, endereco, status, idade",
        )
        .eq("id", id)
        .eq("id_user", IdUser)
        .maybeSingle();

      if (erroPaciente) {
        console.error("Erro ao carregar paciente:", erroPaciente);
        setErroCarregar("Não foi possível carregar a ficha do paciente.");
        setLoading(false);
        return;
      }

      setPaciente((dadosPaciente as PacienteFicha | null) ?? null);

      const { data: dadosEvolucoes, error: erroEvolucoes } = await supabase
        .from("evolucoes")
        .select("id, patologia, texto, created_at")
        .eq("paciente_id", id)
        .order("created_at", { ascending: false });

      if (erroEvolucoes) {
        console.error("Erro ao carregar evoluções:", erroEvolucoes);
      } else {
        setEvolucoes((dadosEvolucoes ?? []) as Evolucao[]);
      }

      setLoading(false);
    }

    carregarFicha();
  }, [id, IdUser]);

  async function exportarProntuario() {
  if (!paciente || exportando) return;

  setExportando(true);
  setFeedback(null);

  const { data: lista, error } = await supabase
    .from("evolucoes")
    .select("id, patologia, texto, created_at, id_agendamento")
    .eq("paciente_id", paciente.id);

  if (error) {
    console.error("Erro ao exportar prontuário:", error);
    setExportando(false);
    setFeedback({
      tipo: "erro",
      mensagem: "Não foi possível gerar o prontuário. Tente novamente.",
    });
    return;
  }

  const registros = (lista ?? []) as (Evolucao & {
    id_agendamento: number | null;
  })[];

  // Busca a data de cada atendimento vinculado às evoluções
  const ids = registros
    .map((r) => r.id_agendamento)
    .filter((v): v is number => !!v);

  const atendimentos = new Map<number, { data_hora: string; tipo: string | null }>();

  if (ids.length > 0) {
    const { data: ags } = await supabase
      .from("agendamentos")
      .select("id, data_hora, tipo")
      .in("id", ids);

    (ags ?? []).forEach((a: { id: number; data_hora: string; tipo: string | null }) =>
      atendimentos.set(a.id, a),
    );
  }

  const itens: EvolucaoExport[] = registros
    .map((r) => {
      const ag = r.id_agendamento ? atendimentos.get(r.id_agendamento) : undefined;
      return {
        id: r.id,
        patologia: r.patologia,
        texto: r.texto,
        created_at: r.created_at,
        data_atendimento: ag?.data_hora ?? r.created_at,
        tipo: ag?.tipo ?? null,
      };
    })
    // Ordem cronológica: do primeiro atendimento ao mais recente
    .sort(
      (a, b) =>
        new Date(a.data_atendimento).getTime() -
        new Date(b.data_atendimento).getTime(),
    );

  const profissional = [titulo, sobrenomeUser].filter(Boolean).join(" ");
  const html = montarDocumento(paciente, itens, profissional);
  const nomeArquivo = `Prontuário - ${nomeCompleto || "Paciente"}`;

  const ok = imprimirHtml(html, nomeArquivo);
  setExportando(false);

  if (!ok) {
    setFeedback({
      tipo: "erro",
      mensagem: "Não foi possível abrir a impressão neste navegador.",
    });
  }
}

  function iniciarEdicao() {
    if (!paciente) return;
    setForm({
      nome: paciente.nome_paciente ?? "",
      sobrenome: paciente.sobrenome_paciente ?? "",
      nascimento: paciente.data_nascimento?.split("T")[0] ?? "",
      genero: paciente.genero ?? "",
      email: paciente.email ?? "",
      telefone: formatarTelefone(paciente.telefone ?? ""),
      endereco: paciente.endereco ?? "",
    });
    setFeedback(null);
    setEditando(true);
  }

  function cancelarEdicao() {
    setEditando(false);
    setForm(null);
  }

  function atualizarCampo<K extends keyof FormDados>(
    campo: K,
    valor: FormDados[K],
  ) {
    setForm((atual) => (atual ? { ...atual, [campo]: valor } : atual));
  }

  async function salvarDados(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!paciente || !form || salvando) return;

    if (!form.nome.trim()) {
      setFeedback({ tipo: "erro", mensagem: "Informe o nome do paciente." });
      return;
    }

    setSalvando(true);
    setFeedback(null);

    const idade = form.nascimento ? calcularIdade(form.nascimento) : null;

    const atualizacao = {
      nome_paciente: form.nome.trim(),
      sobrenome_paciente: form.sobrenome.trim(),
      data_nascimento: form.nascimento || null,
      idade: idade ?? 0,
      genero: form.genero,
      email: form.email.trim(),
      telefone: form.telefone.replace(/\D/g, ""),
      endereco: form.endereco.trim(),
    };

    const { error } = await supabase
      .from("pacientes")
      .update(atualizacao)
      .eq("id", paciente.id)
      .eq("id_user", IdUser);

    setSalvando(false);

    if (error) {
      console.error("Erro ao atualizar paciente:", error);
      setFeedback({
        tipo: "erro",
        mensagem: "Não foi possível salvar as alterações. Tente novamente.",
      });
      return;
    }

    setPaciente({ ...paciente, ...atualizacao });
    setEditando(false);
    setForm(null);
    setFeedback({ tipo: "sucesso", mensagem: "Dados atualizados com sucesso!" });
  }

  const campo =
    "w-full rounded-xl border-none bg-gray-50 py-3 text-sm text-gray-800 ring-1 ring-gray-200 transition placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary";
  const rotulo = "text-sm font-medium text-gray-700";
  const iconeCampo =
    "material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400";

  const nomeCompleto = [paciente?.nome_paciente, paciente?.sobrenome_paciente]
    .filter(Boolean)
    .join(" ");
  const idade = calcularIdade(paciente?.data_nascimento ?? null);
  const ativo = paciente?.status === "Tratamento ativo";
  const ultimaEvolucao = evolucoes[0];
  const evolucoesVisiveis = mostrarTodas
    ? evolucoes
    : evolucoes.slice(0, EVOLUCOES_VISIVEIS);

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
              <Link
                to="/pacientes"
                className="text-gray-500 transition-colors hover:text-primary-dark"
              >
                Pacientes
              </Link>
              <span className="material-symbols-outlined mx-1 text-base text-gray-400">
                chevron_right
              </span>
              <span className="font-semibold">
                {nomeCompleto || "Ficha do paciente"}
              </span>
            </nav>

            {loading && (
              <div className="flex flex-col gap-6" aria-busy="true">
                <div className="h-32 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-black/5" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                  <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-black/5 lg:col-span-2" />
                  <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-black/5 lg:col-span-3" />
                </div>
              </div>
            )}

            {!loading && erroCarregar && (
              <div
                role="alert"
                className="flex items-center gap-3 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600 ring-1 ring-red-100"
              >
                <span className="material-symbols-outlined">error</span>
                {erroCarregar}
              </div>
            )}

            {!loading && !erroCarregar && !paciente && (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-black/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                  <span className="material-symbols-outlined">person_off</span>
                </div>
                <p className="font-semibold">Paciente não encontrado</p>
                <p className="max-w-xs text-sm text-gray-500">
                  Esse paciente não existe ou não pertence à sua conta.
                </p>
                <Link
                  to="/pacientes"
                  className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Voltar para pacientes
                </Link>
              </div>
            )}

            {!loading && paciente && (
              <>
                {/* Cabeçalho da ficha */}
                <header className="flex flex-col justify-between gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:flex-row md:items-center">
                  <div className="flex items-center gap-5">
                    <img
                      className="size-20 shrink-0 rounded-full bg-gray-100 object-cover ring-4 ring-primary/10"
                      src={`https://api.dicebear.com/10.x/personas/svg?seed=${paciente.id}`}
                      alt=""
                    />
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl">
                        {nomeCompleto || "Paciente sem nome"}
                      </h1>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-gray-500">
                        <span className="tabular-nums">
                          Prontuário #{paciente.id}
                        </span>
                        {idade !== null && <span>{idade} anos</span>}
                        {paciente.genero && <span>{paciente.genero}</span>}
                        {paciente.status && (
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
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-col rounded-xl bg-primary/10 px-4 py-2.5 leading-tight">
                      <span className="text-xs text-gray-500">
                        Evoluções registradas
                      </span>
                      <span className="text-xl font-bold tabular-nums text-primary-dark">
                        {evolucoes.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/novaevolucao", {
                          state: { idPaciente: paciente.id },
                        })
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark hover:shadow-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    >
                      <span className="material-symbols-outlined text-xl">
                        clinical_notes
                      </span>
                      Registrar evolução
                    </button>
                  </div>
                </header>

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
                    {feedback.mensagem}
                  </div>
                )}

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
                  {/* Dados do paciente */}
                  <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 lg:col-span-2">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                          <span className="material-symbols-outlined text-xl">
                            person
                          </span>
                        </span>
                        <h2 className="text-lg font-bold">Dados do paciente</h2>
                      </div>
                      {!editando && (
                        <button
                          type="button"
                          onClick={iniciarEdicao}
                          className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                          Editar
                        </button>
                      )}
                    </div>

                    {!editando || !form ? (
                      <div className="flex flex-col gap-5 p-5">
                        <Dado
                          icone="badge"
                          rotulo="Nome"
                          valor={paciente.nome_paciente}
                        />
                        <Dado
                          icone="badge"
                          rotulo="Sobrenome"
                          valor={paciente.sobrenome_paciente}
                        />
                        <Dado
                          icone="calendar_month"
                          rotulo="Data de nascimento"
                          valor={
                            paciente.data_nascimento
                              ? `${new Date(
                                  paciente.data_nascimento,
                                ).toLocaleDateString("pt-BR", {
                                  timeZone: "UTC",
                                })}${idade !== null ? ` (${idade} anos)` : ""}`
                              : null
                          }
                        />
                        <Dado
                          icone="wc"
                          rotulo="Gênero"
                          valor={paciente.genero}
                        />
                        <Dado
                          icone="mail"
                          rotulo="E-mail"
                          valor={paciente.email}
                        />
                        <Dado
                          icone="call"
                          rotulo="Telefone"
                          valor={
                            paciente.telefone
                              ? formatarTelefone(paciente.telefone)
                              : null
                          }
                        />
                        <Dado
                          icone="home"
                          rotulo="Endereço"
                          valor={paciente.endereco}
                        />
                      </div>
                    ) : (
                      <form onSubmit={salvarDados}>
                        <div className="flex flex-col gap-5 p-5">
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <label htmlFor="nome" className={rotulo}>
                                Nome <span className="text-red-500">*</span>
                              </label>
                              <input
                                id="nome"
                                value={form.nome}
                                onChange={(e) =>
                                  atualizarCampo("nome", e.target.value)
                                }
                                required
                                className={`${campo} px-4`}
                                type="text"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label htmlFor="sobrenome" className={rotulo}>
                                Sobrenome
                              </label>
                              <input
                                id="sobrenome"
                                value={form.sobrenome}
                                onChange={(e) =>
                                  atualizarCampo("sobrenome", e.target.value)
                                }
                                className={`${campo} px-4`}
                                type="text"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <label htmlFor="nascimento" className={rotulo}>
                                Data de nascimento
                              </label>
                              <input
                                id="nascimento"
                                value={form.nascimento}
                                max={hojeParaInput()}
                                onChange={(e) =>
                                  atualizarCampo("nascimento", e.target.value)
                                }
                                className={`${campo} px-4`}
                                type="date"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label htmlFor="genero" className={rotulo}>
                                Gênero
                              </label>
                              <div className="relative">
                                <select
                                  id="genero"
                                  value={form.genero}
                                  onChange={(e) =>
                                    atualizarCampo("genero", e.target.value)
                                  }
                                  className={`${campo} appearance-none pl-4 pr-10`}
                                >
                                  <option value="">Selecione</option>
                                  <option value="Masculino">Masculino</option>
                                  <option value="Feminino">Feminino</option>
                                </select>
                                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                  expand_more
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label htmlFor="email" className={rotulo}>
                              E-mail
                            </label>
                            <div className="relative">
                              <span className={iconeCampo}>mail</span>
                              <input
                                id="email"
                                value={form.email}
                                onChange={(e) =>
                                  atualizarCampo("email", e.target.value)
                                }
                                className={`${campo} pl-11 pr-4`}
                                type="email"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label htmlFor="telefone" className={rotulo}>
                              Telefone
                            </label>
                            <div className="relative">
                              <span className={iconeCampo}>call</span>
                              <input
                                id="telefone"
                                value={form.telefone}
                                onChange={(e) =>
                                  atualizarCampo(
                                    "telefone",
                                    formatarTelefone(e.target.value),
                                  )
                                }
                                className={`${campo} pl-11 pr-4 tabular-nums`}
                                placeholder="(11) 99999-9999"
                                type="tel"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label htmlFor="endereco" className={rotulo}>
                              Endereço
                            </label>
                            <div className="relative">
                              <span className={iconeCampo}>home</span>
                              <input
                                id="endereco"
                                value={form.endereco}
                                onChange={(e) =>
                                  atualizarCampo("endereco", e.target.value)
                                }
                                className={`${campo} pl-11 pr-4`}
                                type="text"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
                          <button
                            type="button"
                            disabled={salvando}
                            onClick={cancelarEdicao}
                            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={salvando}
                            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {salvando ? "progress_activity" : "check"}
                            </span>
                            {salvando ? "Salvando..." : "Salvar alterações"}
                          </button>
                        </div>
                      </form>
                    )}
                  </section>

                  {/* Evoluções */}
                  <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 lg:col-span-3">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                          <span className="material-symbols-outlined text-xl">
                            clinical_notes
                          </span>
                        </span>
                        <div className="leading-tight">
                          <h2 className="text-lg font-bold">
                            {mostrarTodas
                              ? "Todas as evoluções"
                              : "Últimas evoluções"}
                          </h2>
                          {ultimaEvolucao && (
                            <p className="text-xs text-gray-500">
                              Última em{" "}
                              {new Date(
                                ultimaEvolucao.created_at,
                              ).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
    type="button"
    onClick={exportarProntuario}
    disabled={exportando || evolucoes.length === 0}
    className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <span className="material-symbols-outlined text-lg">
      {exportando ? "progress_activity" : "print"}
    </span>
    {exportando ? "Gerando..." : "Exportar"}
  </button>
                    </div>

                    {evolucoes.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                          <span className="material-symbols-outlined">
                            edit_note
                          </span>
                        </div>
                        <p className="font-semibold">
                          Nenhuma evolução registrada
                        </p>
                        <p className="max-w-xs text-sm text-gray-500">
                          Quando você registrar a primeira evolução, ela aparece
                          aqui.
                        </p>
                      </div>
                    ) : (
                      <>
                        <ol className="flex flex-col gap-4 p-5">
                          {evolucoesVisiveis.map((evolucao) => {
                            const data = new Date(evolucao.created_at);
                            return (
                              <li
                                key={evolucao.id}
                                className="rounded-xl border-l-4 border-primary bg-primary/5 px-4 py-3"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-bold">
                                    {data.toLocaleDateString("pt-BR", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                    <span className="ml-2 text-xs font-medium tabular-nums text-gray-500">
                                      {data.toLocaleTimeString("pt-BR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </p>
                                  {evolucao.patologia && (
                                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-primary-dark ring-1 ring-primary/20">
                                      {evolucao.patologia}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`mt-2 whitespace-pre-line text-sm text-gray-600 ${
                                    mostrarTodas ? "" : "line-clamp-3"
                                  }`}
                                >
                                  {evolucao.texto || "Sem descrição."}
                                </p>
                              </li>
                            );
                          })}
                        </ol>

                        {evolucoes.length > EVOLUCOES_VISIVEIS && (
                          <div className="border-t border-gray-100 px-5 py-4">
                            <button
                              type="button"
                              aria-expanded={mostrarTodas}
                              onClick={() => setMostrarTodas(!mostrarTodas)}
                              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-600 transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                              <span className="material-symbols-outlined text-lg">
                                {mostrarTodas ? "expand_less" : "expand_more"}
                              </span>
                              {mostrarTodas
                                ? "Mostrar apenas as últimas"
                                : `Ver todas as evoluções (${evolucoes.length})`}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </section>
                </div>
              </>
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