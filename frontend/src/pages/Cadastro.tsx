import { useState, type SubmitEvent } from "react";
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
  const [erro, setErro] = useState("");

  const itsVisivel = view ? "text" : "password";
  const itsVisivelComfimr = viewConfirm ? "text" : "password";
  const eye = view ? "visibility_off" : "visibility";


  async function cadastrar(e: SubmitEvent) {
    e.preventDefault();

    if (password !== passwordConfirm) {
    setErro("As senhas não coincidem");
    return;
  }

    try {
      const usuario = await register({
        nome,
        email,
        password,
        titulo,
      });
      console.log("Usuario criado:", usuario);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="flex min-h-screen w-full">
        <section className="flex flex-col items-center min-h-screen w-full py-10 lg:w-3/5 bg-primary-light">
          <div className="w-full max-w-[480px] flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <span className="material-symbols-outlined text-4xl">
                  ecg_heart
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-black">
                  FisioHub
                </h1>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Crie sua conta
              </h2>
              <p className="text-base text-primary">
                Junte-se á maior plataforma de gestão clinica para
                fisoterapeutas do Brasil.
              </p>
            </div>
            <form onSubmit={cadastrar} className="flex flex-col gap-5 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium ">Nome completo</label>
                <div className="relative">
                  <span className="absolute flex items-center pl-3 pointer-events-none inset-x-0 inset-y-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      person
                    </span>
                  </span>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 pl-10 pr-4 placeholder:text-grey/50 transition-all"
                    placeholder="Ex: Dr. Roberto Silva"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium ">
                  Como você quer ser chamado?
                </label>
                <div className="relative">
                  <span className="absolute flex items-center pl-3 pointer-events-none inset-x-0 inset-y-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      pacemaker
                    </span>
                  </span>
                  <select
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full h-12 pl-10 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none bg-white text-grey"
                    name=""
                    id=""
                  >
                    <option value="">Selecione</option>
                    <option value="M">Dr.</option>
                    <option value="F">Dra.</option>
                    <option value="-">Nenhum</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium ">
                  E-mail Profissional
                </label>
                <div className="relative">
                  <span className="absolute flex items-center pl-3 pointer-events-none inset-x-0 inset-y-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      mail
                    </span>
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 pl-10 pr-4 placeholder:text-grey/50 transition-all"
                    placeholder="Ex: Dr. Roberto Silva"
                    type="text"
                  />
                </div>
              </div>
              <div className="relative flex flex-col gap-1">
                <div className="flex flex-row gap-3">
                  <div className="flex flex-col gap-2 ">
                    <div className="flex justify-between items-center ">
                      <label className="text-sm font-medium ">Senha</label>
                    </div>
                    <div className="relative">
                      <span className="absolute flex items-center pl-3 pointer-events-none inset-x-0 inset-y-0">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          lock
                        </span>
                      </span>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 pl-10 pr-4 placeholder:text-black transition-all"
                        placeholder="••••••••"
                        type={itsVisivel}
                      />
                      <button
                        onClick={() => setView(!view)}
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-black"
                      >
                        <span className="material-symbols-outlined text-primary text-[20px] hover:text-black">
                          {eye}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <div className="flex justify-between items-center ">
                      <label className="text-sm font-medium ">
                        Confirmar Senha
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute flex items-center pl-3 pointer-events-none inset-x-0 inset-y-0">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          lock_reset
                        </span>
                      </span>
                      <input
                      value={passwordConfirm}
                        onChange={(e) => {
                          const valor = e.target.value
                          setPasswordConfirm(valor)
                          if (valor.length>0&&valor!==password){
                            setErro("As senhas não coincidem");
                          } else {
                            setErro("")
                          }

                        }}
                        className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 pl-10 pr-4 placeholder:text-black transition-all"
                        placeholder="••••••••"
                        type={itsVisivelComfimr}
                      />
                      <button
                        onClick={() => setViewConfirm(!viewConfirm)}
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-black"
                      >
                        <span className="material-symbols-outlined text-primary text-[20px] hover:text-black">
                          {viewConfirm? "visibility_off":"visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                {erro && (
    <div className="absolute top-full right-0 mt-1 flex items-center gap-1 text-xs text-red-500">
      <span className="material-symbols-outlined text-[16px]">
        error
      </span>

      <span>{erro}</span>
    </div>
  )}
              </div>
              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-3">
                  <input
                    className="size-5 rounded text-primary focus:ring-primary/20 cursor-pointer"
                    type="checkbox"
                  />
                </div>
                <label className="cursor-pointer text-sm">
                  Eu concordo com os{" "}
                  <a className="text-primary font-bold hover:underline">
                    Termos de Uso
                  </a>{" "}
                  e a{" "}
                  <a className="text-primary font-bold hover:underline">
                    Politica de Privacidade
                  </a>{" "}
                  do FisioHub.
                </label>
              </div>
              <button
                type="submit"
                className="mt-2 w-full bg-primary shadow-md font-semibold h-12 rounded-lg  flex items-center justify-center text-white"
              >
                Criar minha conta{" "}
                <span className="material-symbols-outlined mx-2">
                  arrow_right_alt
                </span>
              </button>
            </form>
            <div className="flex flex-col items-center">
              <div className="" />
              <p>OU REGISTRE-SE COM</p>
              <div />
            </div>
            <p className="flex justify-center text-gray-500">
              Já possui uma conta?{" "}
              <Link
                to="/login"
                className="text-primary mx-2 hover:underline hover:cursor-pointer"
              >
                Faça login
              </Link>
            </p>
          </div>
        </section>
        <section className=" hidden lg:flex flex-col justify-center items-center min-h-screen w-2/5 overflow-hidden sticky top-0">
          <img
            className="object-cover object-center absolute inset-0 w-full h-full"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIeJZZryymAKbtCjRZUiZng9G9Z2Uecwuyl5fNiqUHJTgDLf6tkbQbifHN7cmG8d0n0Ch60TTSilDFMvYnTftPcsI-BkByTKi6GJ8dZpgWk94j9FKShDk13sQomWfdXv73oAdLsBHw5BVn696BLwQ5rKIZPY-eLA-tlu_dv0pW5LVSAIsUNJ4TofpuCG1Wrvu3qtk8HEPnYgvBWQQI_d5g5SYM--IDhVGVKdMKMXPQq7hvsvcYOlXiLEMhWdGGM0wS-0TE0af781g"
            alt="Fisio"
          />
          <div className=" absolute bottom-0 left-0 right-0 z-20 p-12 text-white">
            <div className="max-w-lg">
              <div className="inline-flex items-center justify-center p-2 bg-white/20 backdrop-blur-md rounded-lg mb-6 border border-white/10">
                <span className="material-symbols-outlined">verified_user</span>
                <p className="text-sm font-medium">
                  Plataforma em comformidade com LGPD
                </p>
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Transformando o cuidado ao paciente através de dados
              </h2>
              <p className="text-lg text-white/90 font-light leading-relaxed">
                Acesse análises de pacientes em tempo real, acompanhe o
                progresso da recuperação e gerencie consultas de forma
                transparente com FisioHub
              </p>
            </div>
            <div className="text-white text-sm font-medium mt-8">
              <p>Criado para fisioterapeutas que querem</p>
              <p className="text-white/70 text-xs">
                organizar seus atendimentos
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
