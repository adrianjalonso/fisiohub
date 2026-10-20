import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/auth.service";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [titulo, setTitulo] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [view, setView] = useState(false);
  const [viewConfirm, setViewConfirm] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function cadastrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (salvando) return;

    setErro("");
    setSucesso(false);

    if (password !== passwordConfirm) {
      setErroSenha("As senhas não coincidem");
      return;
    }

    if (!aceitouTermos) {
      setErro("Aceite os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }

    setSalvando(true);

    try {
      const usuario = await register({
        nome,
        email,
        password,
        titulo,
      });
      console.log("Usuario criado:", usuario);
      setSucesso(true);
      setNome("");
      setEmail("");
      setTitulo("");
      setPassword("");
      setPasswordConfirm("");
      setAceitouTermos(false);
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível criar a conta. Verifique os dados e tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  const campo =
    "h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30";
  const rotulo = "text-sm font-medium text-gray-700";
  const iconeCampo =
    "material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-primary";
  const botaoOlho =
    "absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 transition-colors hover:text-gray-700 focus:outline-none focus-visible:text-primary-dark";

  return (
    <main className="flex min-h-screen w-full">
      <section className="flex min-h-screen w-full flex-col items-center justify-center bg-primary-light px-6 py-10 lg:w-3/5">
        <div className="flex w-full max-w-[480px] flex-col gap-8">
          {/* Cabeçalho */}
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-md">
                <span className="material-symbols-outlined">ecg_heart</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-black">
                FisioHub
              </h1>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Crie sua conta
            </h2>
            <p className="text-base text-gray-600">
              Junte-se à plataforma de gestão clínica para fisioterapeutas e
              organize seus atendimentos em um só lugar.
            </p>
          </div>

          <form onSubmit={cadastrar} className="flex w-full flex-col gap-5">
            {sucesso && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary-dark ring-1 ring-primary/20"
              >
                <span className="material-symbols-outlined text-xl">
                  check_circle
                </span>
                <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                  <span>Conta criada com sucesso!</span>
                  <Link
                    to="/login"
                    className="font-bold underline-offset-2 hover:underline"
                  >
                    Fazer login
                  </Link>
                </div>
              </div>
            )}

            {erro && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100"
              >
                <span className="material-symbols-outlined text-xl">error</span>
                {erro}
              </div>
            )}

            {/* Nome */}
            <div className="flex flex-col gap-2">
              <label htmlFor="nome" className={rotulo}>
                Nome completo
              </label>
              <div className="relative">
                <span className={iconeCampo}>person</span>
                <input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  autoComplete="name"
                  className={`${campo} pr-4`}
                  placeholder="Ex: Roberto Silva"
                  type="text"
                />
              </div>
            </div>

            {/* Título */}
            <div className="flex flex-col gap-2">
              <label htmlFor="titulo" className={rotulo}>
                Como você quer ser chamado?
              </label>
              <div className="relative">
                <span className={iconeCampo}>badge</span>
                <select
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  className={`${campo} appearance-none pr-10 ${
                    titulo === "" ? "text-gray-400" : ""
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="M">Dr.</option>
                  <option value="F">Dra.</option>
                  <option value="-">Nenhum</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  expand_more
                </span>
              </div>
            </div>

            {/* E-mail */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={rotulo}>
                E-mail profissional
              </label>
              <div className="relative">
                <span className={iconeCampo}>mail</span>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={`${campo} pr-4`}
                  placeholder="nome@clinica.com.br"
                  type="email"
                />
              </div>
            </div>

            {/* Senhas */}
            <div className="flex flex-col gap-1.5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="senha" className={rotulo}>
                    Senha
                  </label>
                  <div className="relative">
                    <span className={iconeCampo}>lock</span>
                    <input
                      id="senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className={`${campo} pr-11`}
                      placeholder="••••••••"
                      type={view ? "text" : "password"}
                    />
                    <button
                      onClick={() => setView(!view)}
                      type="button"
                      aria-label={view ? "Ocultar senha" : "Mostrar senha"}
                      className={botaoOlho}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {view ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmar-senha" className={rotulo}>
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <span className={iconeCampo}>lock_reset</span>
                    <input
                      id="confirmar-senha"
                      value={passwordConfirm}
                      onChange={(e) => {
                        const valor = e.target.value;
                        setPasswordConfirm(valor);
                        if (valor.length > 0 && valor !== password) {
                          setErroSenha("As senhas não coincidem");
                        } else {
                          setErroSenha("");
                        }
                      }}
                      required
                      autoComplete="new-password"
                      aria-invalid={erroSenha !== ""}
                      className={`${campo} pr-11 ${
                        erroSenha
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : ""
                      }`}
                      placeholder="••••••••"
                      type={viewConfirm ? "text" : "password"}
                    />
                    <button
                      onClick={() => setViewConfirm(!viewConfirm)}
                      type="button"
                      aria-label={
                        viewConfirm ? "Ocultar senha" : "Mostrar senha"
                      }
                      className={botaoOlho}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {viewConfirm ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {erroSenha && (
                <p
                  role="alert"
                  className="flex items-center gap-1 text-xs font-medium text-red-500"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    error
                  </span>
                  {erroSenha}
                </p>
              )}
            </div>

            {/* Termos */}
            <div className="flex items-start gap-3 py-1">
              <input
                id="termos"
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary/30"
                type="checkbox"
              />
              <label
                htmlFor="termos"
                className="cursor-pointer text-sm text-gray-600"
              >
                Eu concordo com os{" "}
                <a
                  href="#"
                  className="font-bold text-primary-dark hover:underline"
                >
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a
                  href="#"
                  className="font-bold text-primary-dark hover:underline"
                >
                  Política de Privacidade
                </a>{" "}
                do FisioHub.
              </label>
            </div>

            <button
              type="submit"
              disabled={salvando}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? "Criando conta..." : "Criar minha conta"}
              <span className="material-symbols-outlined">
                {salvando ? "progress_activity" : "arrow_right_alt"}
              </span>
            </button>
          </form>

          <p className="flex justify-center text-sm text-gray-600">
            Já possui uma conta?
            <Link
              to="/login"
              className="mx-1.5 font-semibold text-primary-dark hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </section>

      {/* Painel de imagem */}
      <section className="sticky top-0 hidden min-h-screen w-2/5 flex-col items-center justify-center overflow-hidden lg:flex">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIeJZZryymAKbtCjRZUiZng9G9Z2Uecwuyl5fNiqUHJTgDLf6tkbQbifHN7cmG8d0n0Ch60TTSilDFMvYnTftPcsI-BkByTKi6GJ8dZpgWk94j9FKShDk13sQomWfdXv73oAdLsBHw5BVn696BLwQ5rKIZPY-eLA-tlu_dv0pW5LVSAIsUNJ4TofpuCG1Wrvu3qtk8HEPnYgvBWQQI_d5g5SYM--IDhVGVKdMKMXPQq7hvsvcYOlXiLEMhWdGGM0wS-0TE0af781g"
          alt="Fisioterapeuta atendendo um paciente"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 z-20 p-12 text-white">
          <div className="max-w-lg">
            <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/20 px-3 py-2 backdrop-blur-md">
              <span className="material-symbols-outlined">verified_user</span>
              <p className="text-sm font-medium">
                Plataforma em conformidade com a LGPD
              </p>
            </div>
            <h2 className="mb-4 text-4xl font-bold leading-tight">
              Transformando o cuidado ao paciente através de dados
            </h2>
            <p className="text-lg font-light leading-relaxed text-white/90">
              Acesse análises de pacientes em tempo real, acompanhe o progresso
              da recuperação e gerencie consultas de forma transparente com o
              FisioHub.
            </p>
          </div>
          <div className="mt-8 text-sm font-medium text-white">
            <p>Criado para fisioterapeutas que querem</p>
            <p className="text-xs text-white/70">organizar seus atendimentos</p>
          </div>
        </div>
      </section>
    </main>
  );
}