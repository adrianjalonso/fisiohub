import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import { useUser } from "../context/UserContext";
import {
  getProfile,
  updateProfile,
  type DadosPerfil,
} from "../services/auth.service";

const campo =
  "h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30";
const rotulo = "text-sm font-medium text-gray-700";
const iconeCampo =
  "material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-primary";

export default function Settings() {
  const { titulo, nome, IdUser, email, atualizarUsuario } = useUser();

  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [form, setForm] = useState<DadosPerfil>({
    nome: nome ?? "",
    titulo: titulo ?? "",
    email: email ?? "",
    crefito: "",
  });
  const [original, setOriginal] = useState<DadosPerfil>({
    nome: nome ?? "",
    titulo: titulo ?? "",
    email: email ?? "",
    crefito: "",
  });

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        const perfil = await getProfile();
        if (!ativo) return;

        const dados: DadosPerfil = {
          nome: perfil.user_nome ?? "",
          titulo: perfil.titulo ?? "",
          email: perfil.user_email ?? "",
          crefito: perfil.crefito ?? "",
        };

        setForm(dados);
        setOriginal(dados);
        atualizarUsuario({
          nome: dados.nome,
          email: dados.email,
          titulo: dados.titulo,
        });
      } catch {
        if (ativo) setErro("Não foi possível carregar seus dados.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, [atualizarUsuario]);

  const nomeCompleto =
    [titulo, nome].filter(Boolean).join(" ").trim() || "Fisioterapeuta";

  function abrirEdicao() {
    setErro("");
    setSucesso("");
    setForm(original);
    setEditando(true);
  }

  function cancelarEdicao() {
    setErro("");
    setSucesso("");
    setForm(original);
    setEditando(false);
  }

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (salvando) return;

    const nomeTrim = form.nome.trim();
    const emailTrim = form.email.trim();

    if (!nomeTrim || !emailTrim) {
      setErro("Nome completo e e-mail são obrigatórios.");
      setSucesso("");
      return;
    }

    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const perfil = await updateProfile({
        nome: nomeTrim,
        titulo: form.titulo,
        email: emailTrim,
        crefito: form.crefito.trim(),
      });

      const dados: DadosPerfil = {
        nome: perfil.user_nome ?? nomeTrim,
        titulo: perfil.titulo ?? form.titulo,
        email: perfil.user_email ?? emailTrim,
        crefito: perfil.crefito ?? "",
      };

      atualizarUsuario({
        nome: dados.nome,
        email: dados.email,
        titulo: dados.titulo,
      });
      setForm(dados);
      setOriginal(dados);
      setSucesso("Dados atualizados com sucesso!");
      setEditando(false);
    } catch (e) {
      setErro(
        e instanceof Error && e.message
          ? e.message
          : "Não foi possível salvar os dados."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <Menu />

      <main className="relative flex h-full flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-64 w-full bg-gradient-to-b from-emerald-100/60 to-transparent"></div>

        <div className="z-10 flex-1 scroll-smooth overflow-y-auto bg-primary/10 p-4 pb-28 sm:p-6 sm:pb-28 lg:p-12 lg:pb-12">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 sm:gap-8">
            {/* Cabeçalho */}
            <header className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Configurações
              </h1>
              <p className="max-w-xl text-gray-600">
                Gerencie sua conta e personalize sua experiência no FisioHub.
              </p>
            </header>

            {/* Perfil */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h2 className="text-lg font-bold">Conta</h2>
                  <p className="text-sm text-gray-500">
                    Informações do profissional logado.
                  </p>
                </div>

                {!editando && (
                  <button
                    type="button"
                    onClick={abrirEdicao}
                    disabled={carregando}
                    className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {carregando ? "progress_activity" : "edit"}
                    </span>
                    {carregando ? "Carregando..." : "Editar dados"}
                  </button>
                )}
              </div>

              {(erro || sucesso) && (
                <div className="px-4 pt-4 sm:px-6">
                  {erro ? (
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100"
                    >
                      <span className="material-symbols-outlined text-xl">
                        error
                      </span>
                      {erro}
                    </div>
                  ) : (
                    <div
                      role="status"
                      className="flex items-start gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary-dark ring-1 ring-primary/20"
                    >
                      <span className="material-symbols-outlined text-xl">
                        check_circle
                      </span>
                      {sucesso}
                    </div>
                  )}
                </div>
              )}

              {editando ? (
                <form onSubmit={salvar} className="flex flex-col gap-4 p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Nome completo */}
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label htmlFor="nome" className={rotulo}>
                        Nome completo
                      </label>
                      <div className="relative">
                        <span className={iconeCampo}>person</span>
                        <input
                          id="nome"
                          value={form.nome}
                          onChange={(e) =>
                            setForm((atual) => ({
                              ...atual,
                              nome: e.target.value,
                            }))
                          }
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
                        Título
                      </label>
                      <div className="relative">
                        <span className={iconeCampo}>badge</span>
                        <select
                          id="titulo"
                          value={form.titulo}
                          onChange={(e) =>
                            setForm((atual) => ({
                              ...atual,
                              titulo: e.target.value,
                            }))
                          }
                          className={`${campo} appearance-none pr-10`}
                        >
                          <option value="">Nenhum</option>
                          <option value="Dr.">Dr.</option>
                          <option value="Dra.">Dra.</option>
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* CREFITO */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="crefito" className={rotulo}>
                        CREFITO
                      </label>
                      <div className="relative">
                        <span className={iconeCampo}>verified</span>
                        <input
                          id="crefito"
                          value={form.crefito}
                          onChange={(e) =>
                            setForm((atual) => ({
                              ...atual,
                              crefito: e.target.value,
                            }))
                          }
                          autoComplete="off"
                          className={`${campo} pr-4`}
                          placeholder="Ex: 123456-F"
                          type="text"
                        />
                      </div>
                    </div>

                    {/* E-mail */}
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label htmlFor="email" className={rotulo}>
                        E-mail
                      </label>
                      <div className="relative">
                        <span className={iconeCampo}>mail</span>
                        <input
                          id="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm((atual) => ({
                              ...atual,
                              email: e.target.value,
                            }))
                          }
                          required
                          autoComplete="email"
                          className={`${campo} pr-4`}
                          placeholder="seuemail@exemplo.com"
                          type="email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={cancelarEdicao}
                      disabled={salvando}
                      className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={salvando}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {salvando ? "progress_activity" : "save"}
                      </span>
                      {salvando ? "Salvando..." : "Salvar alterações"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                  <img
                    src={`https://api.dicebear.com/10.x/personas/svg?backgroundColor=ff5d8f,ffb703,43aa8b,4d96ff,b57bff&seed=${IdUser}`}
                    alt="Foto de perfil"
                    className="size-16 shrink-0 rounded-full bg-white ring-2 ring-primary/20 sm:size-20"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xl font-bold text-gray-900">
                      {nomeCompleto}
                    </p>
                    <p className="text-sm text-gray-500">Fisioterapeuta</p>
                    {email && (
                      <p className="truncate text-sm text-gray-500">{email}</p>
                    )}
                    <p className="mt-1 text-xs tabular-nums text-gray-400">
                      ID #{IdUser}
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                  >
                    <span className="material-symbols-outlined text-lg">
                      logout
                    </span>
                    Sair da conta
                  </Link>
                </div>
              )}
            </section>

            {/* Preferências */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <div className="border-b border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg font-bold">Preferências</h2>
                <p className="text-sm text-gray-500">
                  Ajustes do aplicativo neste dispositivo.
                </p>
              </div>

              <ul className="divide-y divide-gray-100">
                <li className="flex items-center justify-between gap-4 p-4 sm:p-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                      <span className="material-symbols-outlined text-xl">
                        notifications
                      </span>
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        Lembretes de evolução
                      </p>
                      <p className="text-sm text-gray-500">
                        Avisos de sessões sem anotação.
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
                    Ativo
                  </span>
                </li>

                <li className="flex items-center justify-between gap-4 p-4 sm:p-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                      <span className="material-symbols-outlined text-xl">
                        shield_lock
                      </span>
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        Privacidade dos dados
                      </p>
                      <p className="text-sm text-gray-500">
                        Dados protegidos conforme a LGPD.
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Protegido
                  </span>
                </li>
              </ul>
            </section>

            <div className="flex justify-center pb-4 pt-2">
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
