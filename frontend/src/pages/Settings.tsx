import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import { useUser } from "../context/UserContext";

export default function Settings() {
  const { titulo, sobrenome, nome, IdUser } = useUser();

  const nomeCompleto =
    [nome || titulo, sobrenome].filter(Boolean).join(" ").trim() ||
    "Fisioterapeuta";

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
              <div className="border-b border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg font-bold">Conta</h2>
                <p className="text-sm text-gray-500">
                  Informações do profissional logado.
                </p>
              </div>

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
