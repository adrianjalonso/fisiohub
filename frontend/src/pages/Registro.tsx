import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";
import Menu from "../components/Menu";

function formatarTelefone(valor: string) {
  valor = valor.replace(/\D/g, "");

  valor = valor.slice(0, 11);
  if (valor.length <= 2) {
    return valor;
  }

  if (valor.length <= 7) {
    return `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  }

  return `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
}

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

type Feedback = { tipo: "sucesso" | "erro"; mensagem: string } | null;

// IdUser pode vir por prop (como era antes) ou do contexto do usuário
export default function Registro({ IdUser: idUserProp }: { IdUser?: number }) {
  const { IdUser: idUserContexto } = useUser();
  const IdUser = idUserProp ?? idUserContexto;
  const navigate = useNavigate();

  const [nomeNovoPaciente, setNomeNovoPaciente] = useState("");
  const [DataDeNascimento, setDataDeNascimento] = useState("");
  const [idade, setIdade] = useState(0);
  const [emailPaciente, setEmailPaciente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [genero, setGenero] = useState("");
  const [anamnese, setAnamnese] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const telefoneSemFormatar = telefone.replace(/\D/g, "");

  async function registrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (salvando) return;

    setSalvando(true);
    setFeedback(null);

    const { data, error } = await supabase.from("pacientes").insert({
      nome_paciente: nomeNovoPaciente.trim(),
      data_nascimento: DataDeNascimento || null,
      idade: idade,
      email: emailPaciente,
      telefone: telefoneSemFormatar,
      endereco: endereco,
      id_user: IdUser,
      genero: genero,
    });

    setSalvando(false);

    if (error) {
      console.error(error);
      setFeedback({
        tipo: "erro",
        mensagem: "Não foi possível salvar o paciente. Tente novamente.",
      });
      return;
    }

    console.log("Paciente cadastrado!", data);
    setFeedback({
      tipo: "sucesso",
      mensagem: "Paciente cadastrado com sucesso!",
    });
    setDataDeNascimento("");
    setEmailPaciente("");
    setEndereco("");
    setGenero("");
    setIdade(0);
    setNomeNovoPaciente("");
    setTelefone("");
    setAnamnese("");
  }

  const campo =
    "w-full rounded-xl border-none bg-gray-50 py-3 text-sm text-gray-800 ring-1 ring-gray-200 transition placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary";
  const rotulo = "text-sm font-medium text-gray-700";
  const iconeCampo =
    "material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400";
  const iconeSecao =
    "flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary-dark";

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
                to="/pacientes"
                className="text-gray-500 transition-colors hover:text-primary-dark"
              >
                Pacientes
              </Link>
              <span className="material-symbols-outlined mx-1 text-base text-gray-400">
                chevron_right
              </span>
              <span className="font-semibold">Novo paciente</span>
            </nav>

            {/* Cabeçalho */}
            <header className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Cadastro de pacientes
              </h1>
              <p className="max-w-xl text-gray-600">
                Insira os detalhes abaixo para cadastrar um novo paciente para
                acompanhamento clínico e gestão de evoluções.
              </p>
            </header>

            {/* Formulário */}
            <form
              onSubmit={registrar}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              {feedback && (
                <div className="px-6 pt-6 md:px-8 md:pt-8">
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
                          to="/pacientes"
                          className="font-bold underline-offset-2 hover:underline"
                        >
                          Ver pacientes
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Informações pessoais */}
              <div className="border-b border-gray-100 p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className={iconeSecao}>
                    <span className="material-symbols-outlined text-xl">
                      person
                    </span>
                  </span>
                  <h3 className="text-lg font-bold">Informações pessoais</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="nome" className={rotulo}>
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className={iconeCampo}>badge</span>
                      <input
                        id="nome"
                        value={nomeNovoPaciente}
                        onChange={(e) => setNomeNovoPaciente(e.target.value)}
                        required
                        className={`${campo} pl-11 pr-4`}
                        placeholder="Ex: Maria Silva"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="nascimento" className={rotulo}>
                        Data de nascimento
                      </label>
                      <div className="relative">
                        <span className={iconeCampo}>calendar_month</span>
                        <input
                          id="nascimento"
                          value={DataDeNascimento}
                          max={hojeParaInput()}
                          onChange={(e) => {
                            setDataDeNascimento(e.target.value);
                            setIdade(
                              e.target.value
                                ? calcularIdade(e.target.value)
                                : 0,
                            );
                          }}
                          className={`${campo} pl-11 pr-4`}
                          type="date"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="genero" className={rotulo}>
                        Gênero
                      </label>
                      <div className="relative">
                        <span className={iconeCampo}>wc</span>
                        <select
                          id="genero"
                          value={genero}
                          onChange={(e) => setGenero(e.target.value)}
                          className={`${campo} appearance-none pl-11 pr-10 ${
                            genero === "" ? "text-gray-400" : ""
                          }`}
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

                    <div className="flex flex-col gap-2">
                      <span className={rotulo}>Idade</span>
                      <div
                        aria-live="polite"
                        className="flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium tabular-nums text-gray-500"
                      >
                        {DataDeNascimento ? `${idade} anos` : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="border-b border-gray-100 p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className={iconeSecao}>
                    <span className="material-symbols-outlined text-xl">
                      contact_phone
                    </span>
                  </span>
                  <h3 className="text-lg font-bold">Detalhes de contato</h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className={rotulo}>
                      E-mail
                    </label>
                    <div className="relative">
                      <span className={iconeCampo}>mail</span>
                      <input
                        id="email"
                        value={emailPaciente}
                        onChange={(e) => setEmailPaciente(e.target.value)}
                        className={`${campo} pl-11 pr-4`}
                        placeholder="maria@exemplo.com"
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
                        value={telefone}
                        onChange={(e) =>
                          setTelefone(formatarTelefone(e.target.value))
                        }
                        className={`${campo} pl-11 pr-4 tabular-nums`}
                        placeholder="(11) 99999-9999"
                        type="tel"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="endereco" className={rotulo}>
                      Endereço
                    </label>
                    <div className="relative">
                      <span className={iconeCampo}>home</span>
                      <input
                        id="endereco"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className={`${campo} pl-11 pr-4`}
                        placeholder="Av. Paulista, 1000, São Paulo, SP"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Anamnese */}
              <div className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className={iconeSecao}>
                    <span className="material-symbols-outlined text-xl">
                      medical_services
                    </span>
                  </span>
                  <h3 className="text-lg font-bold">Anamnese</h3>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <label htmlFor="anamnese" className={rotulo}>
                      Motivo da fisioterapia
                    </label>
                    <span className="text-xs text-gray-400">
                      Inclua os principais sintomas e a duração
                    </span>
                  </div>
                  <textarea
                    id="anamnese"
                    onChange={(e) => setAnamnese(e.target.value)}
                    value={anamnese}
                    className={`${campo} resize-y px-4`}
                    placeholder="Descreva a queixa principal do paciente, histórico de lesões e quaisquer detalhes relevantes..."
                    rows={6}
                  ></textarea>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end md:px-8 md:py-5">
                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => navigate("/pacientes")}
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
                  {salvando ? "Salvando..." : "Salvar cadastro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}