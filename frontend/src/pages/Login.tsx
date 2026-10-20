import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type LoginProps = {
  setTitulo: React.Dispatch<React.SetStateAction<string>>;
  setSobrenome: React.Dispatch<React.SetStateAction<string>>;
  setIdUser: React.Dispatch<React.SetStateAction<number>>;
};

export default function Login({
  setTitulo,
  setSobrenome,
  setIdUser,
}: LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [visible, setVisible] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState("");

  async function verificar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (entrando) return;

    setErro("");
    setEntrando(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_email", email.trim())
      .single();

    setEntrando(false);

    if (data) {
      setTitulo(`${data.titulo} `);
      localStorage.setItem("titulo", data.titulo);
      setSobrenome(data.user_sobrenome);
      localStorage.setItem("sobrenome", data.user_sobrenome);
      setIdUser(data.user_id);
      localStorage.setItem("IdUser", String(data.user_id));
      navigate("/dashboard");
    } else {
      console.log("supabase error", error);
      console.log("supabase data", data);
      setErro(
        "E-mail não encontrado. Confira o endereço ou crie uma conta.",
      );
    }
  }

  const campo =
    "h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30";
  const rotulo = "text-sm font-medium text-gray-700";
  const iconeCampo =
    "material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-primary";

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
              Entre na sua conta
            </h2>
            <p className="text-base text-gray-600">
              Gerencie seus pacientes e evoluções clínicas de forma eficiente.
            </p>
          </div>

          <form onSubmit={verificar} className="flex w-full flex-col gap-5">
            {erro && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100"
              >
                <span className="material-symbols-outlined text-xl">error</span>
                {erro}
              </div>
            )}

            {/* E-mail */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={rotulo}>
                E-mail
              </label>
              <div className="relative">
                <span className={iconeCampo}>mail</span>
                <input
                  id="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErro("");
                  }}
                  value={email}
                  required
                  autoComplete="email"
                  className={`${campo} pr-4`}
                  placeholder="seuemail@exemplo.com"
                  type="email"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className={rotulo}>
                  Senha
                </label>
                <a
                  className="text-sm font-medium text-primary-dark transition-colors hover:underline"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <span className={iconeCampo}>lock</span>
                <input
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={`${campo} pr-11`}
                  placeholder="••••••••"
                  type={visible ? "text" : "password"}
                />
                <button
                  onClick={() => setVisible(!visible)}
                  type="button"
                  aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 transition-colors hover:text-gray-700 focus:outline-none focus-visible:text-primary-dark"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {visible ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={entrando}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {entrando ? "Entrando..." : "Entrar"}
              <span className="material-symbols-outlined">
                {entrando ? "progress_activity" : "login"}
              </span>
            </button>
          </form>

          <p className="flex justify-center text-sm text-gray-600">
            Não tem uma conta?
            <Link
              to="/cadastro"
              className="mx-1.5 font-semibold text-primary-dark hover:underline"
            >
              Registre-se aqui
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