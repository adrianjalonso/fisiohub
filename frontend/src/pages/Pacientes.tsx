import { Link } from "react-router-dom";

export default function Pacientes() {
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
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p12 z-10 scroll-smooth">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <nav className="flex items-center text-sm font-medium">
              <Link
                to="/dashboard"
                className="transition-colors hover: text-primary"
              >
                Painel
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span>Pacientes</span>
            </nav>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                  Lista de pacientes
                </h2>
                <p className="text-base max-w-xl">
                  Gerencie seus pacientes, acompanhe evoluções clínicas e agende
                  consultas com eficiência.
                </p>
              </div>
              <div className="hidden lg:flex gap-6">
                <div className="flex flex-col items-end px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Total de pacientes
                  </span>
                  <span className="text-2xl font-bold">142</span>
                </div>
                <div className="flex flex-col items-end px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Ativos hoje
                  </span>
                  <span className="text-2xl font-bold text-primary">12</span>
                </div>
              </div>
            </header>
            <div className="p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined transition-colors">
                    search
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border-none ring-1 ring-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                  placeholder="Buscar paciente..."
                  type="text"
                />
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <button className="flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                  Filtrar
                </button>
                <Link to="/registro" className="flex-1 md:flex-none items-center justify-center px-6 py-3 rounded-lg bg-primary text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex gap-2 min-w-[180px]">
                  <span className="material-symbols-outlined">add</span>
                  Novo paciente
                </Link>
              </div>
            </div>
            <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider w-16">
                        <input
                          className="rounded border-gray-300 text-primary focus:rong-primary bg-transparent"
                          type="checkbox"
                        />
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider ">
                        Nome
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider ">
                        Idade/ Gênero
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider ">
                        Ultima evolução
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider ">
                        Status
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider  text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <td className="py-4 px-6 align-middle">
                        <input
                          className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          <img
                            className="size-10 rounded-full object-cover bg-gray-200"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0U7gT7ef_ihGSOroXxpYFu44fmDV6-uZfKSBpQod30DYTPCq2Aylh93C4ajKEGUuWIcfge-CUSQD3vbluu6o0LYifa0I7-DqwT2CLgC6wy4HbFQZKsXPcFoygiwjdPZSZb44lmhhebkjLGjxp9f1pvAYHuqRHIIkOIC4Wj2X_do2qGUYLQCzDGsJ1NZRzSul9uQFZWJbz76yrUsc-baPlUAJ0Hx72v50A8Li5FI2SPhcrktXm8y4_CX7Eb6uod9cE_8dcQCyaVKA"
                            alt="paciente"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-base">
                              Sarah Jenkins
                            </span>
                            <span className="text-xs text-primary/90 ">
                              ID: #PT-2023-89
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="text-sm ">32 anos</div>
                        <div className="text-xs ">Feminino</div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            history
                          </span>
                          <span className="text-sm font-medium">
                            24 Out, 2023
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          Tratamento ativo
                        </span>
                      </td>
                      <td className="py-4 px-6 align-middle text-right">
                        <button className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100">
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <td className="py-4 px-6 align-middle">
                        <input
                          className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                            MR
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-base">
                              Marcus Reed
                            </span>
                            <span className="text-xs text-primary/90 ">
                              ID: #PT-2023-44
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="text-sm ">45 anos</div>
                        <div className="text-xs ">Masculino</div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            history
                          </span>
                          <span className="text-sm font-medium">
                            20 Out, 2023
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          Tratamento ativo
                        </span>
                      </td>
                      <td className="py-4 px-6 align-middle text-right">
                        <button className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100">
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <td className="py-4 px-6 align-middle">
                        <input
                          className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          <img
                            className="size-10 rounded-full object-cover bg-gray-200"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCbjvL6zLS2kQh10Y8yWRrHmA4A1gWVCyvXA9v6DsY-uxQJ-iOG--SmwgVz5Wx8hCOUfgU1e-FcUr0ELs9uJcQdTat4nwlbQMSPu29digqfn0bYrRQpJvEf6jRJiXeusz48bdMC5ZoQ9qihc_ZtwPu99luvnodeqjJymCoOZkAgfYSVUq-3Pq7DE1G3tyB7QG-Gtqkg90sdiU681SGSfjL38vnr09cAvmic3tZdEsGPtgT8xBMMG2pOzvi9CSNk8aFbRfkLwHJWoQ"
                            alt="paciente"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-base">
                              Arthur C. Clarke
                            </span>
                            <span className="text-xs text-primary/90 ">
                              ID: #PT-2023-12
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="text-sm ">72 anos</div>
                        <div className="text-xs ">Masculino</div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            history
                          </span>
                          <span className="text-sm font-medium">
                            18 Out, 2023
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          Avaliação pendente
                        </span>
                      </td>
                      <td className="py-4 px-6 align-middle text-right">
                        <button className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100">
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <td className="py-4 px-6 align-middle">
                        <input
                          className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          <img
                            className="size-10 rounded-full object-cover bg-gray-200"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-rO7V36CphQekEMHu799Lujja597trsUpZzYo1ONNowZqoLVdBt71O6enl60oSMk0UNZTIOPBwyAMSchcUe2EdB59BPjFeOf527gL6QmNUCxTv0xHjLEL5gj9dZx_rmFAy3ee6KhTNy6pPKkEn7tIXv6M1i82HUdXLodaCy0oJOcRuxEM_Tw5RhspDKzhH3znEhb2WmN4J5zBt3ymFETjcbPWpPmlQgFIeo_FRLb__PR1Uwlt0Y4K-U67RJlIFJuYTufni52JgWE"
                            alt="paciente"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-base">
                              Elena Rodriguez
                            </span>
                            <span className="text-xs text-primary/90 ">
                              ID: #PT-2023-99
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="text-sm ">28 anos</div>
                        <div className="text-xs ">Feminino</div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            history
                          </span>
                          <span className="text-sm font-medium">
                            30 Set, 2023
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                          Alta
                        </span>
                      </td>
                      <td className="py-4 px-6 align-middle text-right">
                        <button className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100">
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <td className="py-4 px-6 align-middle">
                        <input
                          className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                            JD
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-base">
                              John Doe
                            </span>
                            <span className="text-xs text-primary/90 ">
                              ID: #PT-2023-01
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="text-sm ">55 anos</div>
                        <div className="text-xs ">Masculino</div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            history
                          </span>
                          <span className="text-sm font-medium">
                            15 Set, 2023
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          Tratamento ativo
                        </span>
                      </td>
                      <td className="py-4 px-6 align-middle text-right">
                        <button className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100">
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-auto border-t border-gray-100 px-6 py-4 flex flex-col md:flex-row items-center justify-center gap-4">
                <p className="text-sm">
                  Mostrando <span className="font-medium">1-5</span> de <span className="font-medium">142</span> pacientes
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium bg-transparent border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">Anterior</button>
                  <button className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">Próximo</button>
                </div>
              </div>
            </div>
            <div className="flex justify-center pb-8 pt-4">
              <p className="text-xs text-center text-primary">
                © 2023 FisioHub. Todos os direitos reservados. <br/>
                        Informações Confidenciais do Paciente.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
