import { Link } from "react-router-dom";

export default function FichaPaciente() {
  return (
    <div className="h-screen overflow-hidden flex flex-row">
      <aside className="flex h-full w-72 flex-col justify-between border-r border-green-100 transition-colors duration-200">
        <div className="flex flex-col gap-8 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md">
              <span className="material-symbols-outlined">
                health_and_safety
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold -tracking-tight text-black">
                FisioHub
              </h1>
              <p className=" text-xs font-medium">Portal do Fisioterapeuta</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-lg hover:bg-primary-light/50 px-4 py-3 text-sm font-medium text-primary-dark transition-colors hover:bg-gray-300"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p>Painel</p>
            </Link>
            <Link
              to="/pacientes"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-primary-dark transition-colors  bg-primary/30"
            >
              <span className="material-symbols-outlined">group</span>
              <p>Pacientes</p>
            </Link>
            <Link
              to="/agenda"
              className="flex items-center gap-3 rounded-lg hover:bg-primary-light/50 px-4 py-3 text-sm font-medium text-primary-dark transition-colors hover:bg-gray-300"
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <p>Agenda</p>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-lg hover:bg-primary-light/50 px-4 py-3 text-sm font-medium text-primary-dark transition-colors hover:bg-gray-300"
            >
              <span className="material-symbols-outlined">settings</span>
              <p>Configurações</p>
            </Link>
          </nav>
        </div>
        <div className="border-t border-green-100 p-6 ">
          <div className="flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-USvt2QK8j5DxxFW-cf6lesmeomLA1KXWNliUpmM5Uf7h32shIZSmgONkDg16vBZWMoc5_L-1MvNPbrjChE49PDu1UfEoW1y7Y9X22xmA7bd6vmufVZ4FnGdHFCtKw2ZqRoAkbT9CboU6R8xHLpkejoVqL29lRTOAvFVoSVgYcIpa2j2IpoaYq6Ms6QgQoIi1dzLUf6KsJBXlAtEy-m_Inhm3GzYMeay1VyN0CqdKwkxFjIj3FsO5zQwqH7D2jkpaWdaviMpD3dk"
              className="h-10 w-10 rounded-full bg-cover bg-center ring-2 ring-white"
            ></img>
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="truncate text-sm font-bold text-black">
                Dra. Carolina Abdon
              </p>
              <p className="truncate text-xs font-bold">Fisioterapeuta</p>
            </div>
            <Link
              to="/login"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 w-full h-full overflow-scroll max-w-7xl mx-auto px-4 sm:px-6 py-6 ">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link
            to="/dashboard"
            className=" text-primary hover:text-primary transition-colors flex items-center gap-1"
          >
            Painel
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            to="/pacientes"
            className=" text-primary hover:text-primary transition-colors flex items-center gap-1"
          >
            Pacientes
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span>Sarah Jenkins</span>
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="size-32 rounded-full overflow-hidden border-4 border-primary shadow-inner">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuABqLctS9Wy_nhvZeLzxNKb0ik8mwfSkZgFaitJV77BPwtm8R7KCiezXZpOiTWzRD3DdOFfZL9VIO_m4Ia7JcCSZbgngGOTq5B92MfuFfi2zvxHdDtXifqdFwBDVigNX2lkg462dLigjsjOIgULumsF3yRj9qxSy_UntLCKxEqV7ol2nUv0cs1E6dlQEDLBl48VNOBFW7FY7KkgXtNTOSeZfwrPC7eskWjs8cDzeLPuloYQvxsoFlfONR1VSV8qU4NW5tC97QBzWR4"
                      alt=""
                    />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-white">
                    Ativo
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 text-center">
                  Sarah Jenkins
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  ID do paciente: #PT-2023-849
                </p>
                <div className="flex gap-2 mt-4 w-full">
                  <button className="flex-1 bg-primary hover:bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-200">
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                    Editar
                  </button>
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      archive
                    </span>
                    Arquivar
                  </button>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl text-center border border-slate-100">
                  <span className="block text-slate-400 text-xs uppercase tracking-wider font-semiboldbold">
                    Idade
                  </span>
                  <span className="block text-slate-900 text-lg font-bold">
                    45
                  </span>
                </div>
                <div className="p-3 rounded-xl text-center border border-slate-100">
                  <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    Gênero
                  </span>
                  <span className="block text-slate-900 text-lg font-bold">
                    Masc.
                  </span>
                </div>
                <div className="p-3 rounded-xl text-center border border-slate-100">
                  <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    Peso
                  </span>
                  <span className="block text-slate-900 text-lg font-bold">
                    82kg
                  </span>
                </div>
                <div className="p-3 rounded-xl text-center border border-slate-100">
                  <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    Altura
                  </span>
                  <span className="block text-slate-900 text-lg font-bold">
                    1.80m
                  </span>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="bg-green-100 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">
                      call
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      Telefone
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      (555)123-4567
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="bg-green-100 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">
                      mail
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">E-mail</p>
                    <p className="text-sm font-medium text-slate-900">
                      johndoe@email.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="bg-green-100 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">
                      location_on
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Endereço</p>
                  <p className="text-s font-mediumm text-slate-900">
                    123 Maple Ave, Springfield
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-8">
            <div className="bg-gradient-to-br from-[#e7f3eb] to-white rounded-2xl p-6 shadow-sm border border-primary/20 overflow-hidden">
              <div className="p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl text-primary">
                  calendar_month
                </span>
              </div>
              <div className=" z-10">
                <h3 className="text-primary font-bold text-sm uppercase tracking-wide mb-1">
                  Próxima consulta
                </h3>
                <p className="text-2xl font-bold text-slate-900">
                  24, Out, 2023
                </p>
                <p className="text-lg text-slate-600 font-medium mb-4">
                  10:00 - 11:00
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white text-slate-900 py-2 px-3 rounded-lg text-xs font-bold border border-slate-200 hover:border-primary transition-all">
                    Reagendar
                  </button>
                  <button className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm">
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-8 mt-6">
              <div className="rounded-2xl p-6 shadow-lg shadow-slate-200/50  border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      edit_note
                    </span>
                    Nova evoluçao
                  </h2>
                  <span className="text-sm text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                    26 Out, 2023 • Hoje
                  </span>
                </div>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <button className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
                    Nota SOAP
                  </button>
                  <button className="bg-white text-slate-600 border border-slate-200 hover:border-primary/50 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
                    Nota rápida
                  </button>
                  <button className="bg-white text-slate-600 border border-slate-200 hover:border-primary/50 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
                    Avaliação
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">
                        Subjetivo
                      </label>
                      <textarea
                        className="w-full border-none rounded-lg text-sm text-slate-900 p-3 h-24 focus:ring-2 focus:ring-primary resize-none placeholder-slate-400"
                        placeholder="Descreva a evolução clínica aqui..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">
                        Objetivo
                      </label>
                      <textarea
                        className="w-full border-none rounded-lg text-sm text-slate-900 p-3 h-24 focus:ring-2 focus:ring-primary resize-none placeholder-slate-400"
                        placeholder="Observações..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">
                  Avaliação e plano
                </label>
                <textarea
                  className="w-full border-none rounded-lg text-sm text-slate-900 p-3 h-20 focus:ring-2 focus:ring-primary resize-none placeholder-slate-400"
                  placeholder="Plano de tratamento e próximos passos..."
                ></textarea>
              </div>
            </div>
            <div className="flex flex-col justify-between items-center mt-6 pt-4 border-t border-slate-100">
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  <button
                    className="p-2 text-slate-400 hover:text-primary hover:bg-green-50 rounded-lg transition-colors"
                    title="Anexar imagem"
                  >
                    <span className="material-symbols-outlined">image</span>
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-primary hover:bg-green-50 rounded-lg transition-colors"
                    title="Anexar documento"
                  >
                    <span className="material-symbols-outlined">
                      attach_file
                    </span>
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-primary hover:bg-green-50 rounded-lg transition-colors"
                    title="Voz para texto"
                  >
                    <span className="material-symbols-outlined">mic</span>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="text-slate-500 font-semibold text-sm hover:text-slate-800 px-4 py-2">
                    Salvar rascunho
                  </button>
                  <button className="bg-primary hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md shadow-green-200 transition-transform active:scale-95 flex items-center gap-2">
                    <span className="material-symbols-outlined">save</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6  w-full">
                <h3 className="text-xl font-bold text-slate-900">
                  Histórico de evoluções
                </h3>
                <div className="flex gap-2">
                  <select className="bg-white border-none text-sm font-medium text-slate-600 rounded-lg py-2 pl-3 pr-8 focus:ring-1 focus:ring-primary cursor-pointer shadow-sm">
                    <option>Todos os tipos</option>
                    <option>Consultas</option>
                    <option>Avaliações</option>
                  </select>
                  <select className="bg-white border-none text-sm font-medium text-slate-600 rounded-lg py-2 pl-3 pr-8 focus:ring-1 focus:ring-primary cursor-pointer shadow-sm">
                    <option>Mais Recentes</option>
                    <option>Mais Antigos</option>
                  </select>
                </div>
              </div>
              <div className="relative space-y-8 pl-4 before:content-[''] before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-200">
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 size-[56px]  flex flex-col items-center justify-start bg-transparent z-10">
                    <div className="size-3 rounded-full bg-primary ring-4 ring-white shadow-sm mt-6"></div>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-900/40 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Acompanhamento</div>
                        <span className="text-slate-400 text-sm font-medium">20 Out, 2023 às 09:30</span>
                      </div>
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Sessão de terapia manual</h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">Paciente relata redução da dor na região lombar (3/10). Realizada terapia manual focada na mobilização de L4-L5. Amplitude de movimento melhorou 15 graus na flexão. Paciente tolerou bem o tratamento.</p>
                    <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="material-symbols-outlined">person</span>Dr. Sarah Jenkins
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium ml-auto">
                        <span className="material-symbols-outlined">check_circle</span>Status: Melhorou
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 size-[56px] flex flex-col items-center justify-start bg-transparent z-10">
                    <div className="size-3 rounded-full bg-slate-300 ring-4 ring-white shadow-sm mt-6 transition-colors"></div>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow opacity-90">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Avaliaçao inicial</div>
                        <span className="text-slate-400 text-sm font-medium">12 Out, 2023 ás 14:15</span>
                      </div>
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Admissão e diagnóstico</h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">Paciente apresentou dor lombar aguda (7/10). Histórico de trabalho sedentário. Avaliação inicial mostra rigidez muscular nos isquiotibiais e estabilidade do core fraca.</p>
                    <div className="flex gap-2 mb-4">
                      <div className="relative group/img cursor-pointer size-24 rounded-lg overflow-hidden border border-slate-200">
                        <img className="w-full h-full object-cover transition-transform group-hover/img:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEvhL2SIsE0B0JX57zx-AQa7YVP2-OXmwNQvu8TpEpvHFjNQGFBmloFr9ObZyenWpI3_HlOoKxjmwh47cCQSzuoLtWKt9c4Tawx_vSJLkqJ63kM5DC8djhq5KMAjzR0C-dshWyLYJbQ9gm3ignbfnbelpArqOytN0GFtiQTjjhI0Bp68qAbNH9iDzIbaLuRCPR7T1E2j-jjEHuixP4CN4YjU-GumIEPJWey0rGG_DHxXMtoqAIpO03Ttzk57-YnBcw_P52sNup0tg" alt="scanner" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">visibility</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="material-symbols-outlined">person</span>Dra. Sarah Jenkins
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 size-[56px] flex flex-col items-center justify-start bg-transparent z-10">
                    <div className="size-3 rounded-full bg-slate-300 ring-4 ring-white shadow-sm mt-6 transition-colors"></div>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow opacity-75">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Encaminhamento</div>
                        <span className="text-slate-400 text-sm font-medium">10 Out, 2023</span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">Encaminhamento recebido do Dr. Silva (Clínico Geral) referente a desconforto lombar crônico.</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-3 text-sm text-slate-500 hover:text-primary font-medium border-t border-dashed border-slate-300 transition-colors">Ver histórico antigo (2022)</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
