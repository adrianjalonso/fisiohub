import Menu from "../components/Menu";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function Agenda() {

  interface Agendamentos{
    id: number,
    paciente_id: number,
    data_hora: string,
    tipo: string,
    status: string,
    obsevacao: string
  }

  const { IdUser } = useUser()
  const [Agenda, setAgenda] = useState<Agendamentos[]>([])

  useEffect(()=>{

   async function carregarAgenda(){
    const {data,error}= await supabase.from("agendamentos").select("*").eq("id_user",IdUSer)

    if(data){
      setAgenda(data)
    } else {
      console.log(error)
    }

   } 

   carregarAgenda()
    
  },[])

  return (
    <div className="h-screen overflow-hidden flex flex-row bg-slate-50">
      <Menu />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-100/60 to-transparent pointer-events-none"></div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 z-10 scroll-smooth">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">

            {/* Breadcrumb */}
            <nav className="flex items-center text-sm font-medium text-slate-500">
              <Link
                to="/dashboard"
                className="transition-colors hover:text-emerald-600"
              >
                Painel
              </Link>

              <span className="mx-2 text-slate-300">/</span>

              <span className="text-slate-800">Agenda</span>
            </nav>

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                  Agenda
                </h2>

                <p className="text-base max-w-xl text-slate-500">
                  Gerencie seus horários e atendimentos.
                </p>
              </div>

              <div className="flex items-center gap-3">

                {/* Visualização */}
                <div className="flex border border-slate-200 bg-white rounded-lg p-1 shadow-sm">
                  <button className="px-3 py-1.5 rounded-md bg-emerald-600 text-white font-semibold shadow-sm">
                    Dia
                  </button>

                  <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                    Semana
                  </button>

                  <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                    Mês
                  </button>
                </div>

                {/* Novo agendamento */}
                <button className="flex-1 md:flex-none items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25 transition-all flex gap-2 min-w-[180px]">
                  <span className="material-symbols-outlined">add</span>
                  Novo Agendamento
                </button>
              </div>
            </header>

            {/* Agenda + Resumo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-gap-lg h-[calc(100vh-12rem)]">

              {/* CALENDÁRIO */}
              <div className="lg:col-span-8 xl:col-span-9 rounded-xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm">

                {/* Cabeçalho do calendário */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">

                  <div className="flex items-center gap-4">

                    <button className="p-2 rounded-full transition-colors text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </button>

                    <h3 className="font-bold text-lg text-slate-800">
                      15 de Novembro, 2023
                    </h3>

                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-700">
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  </div>

                  <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                    Hoje
                  </button>
                </div>

                {/* Grade de horários */}
                <div className="flex-grow overflow-y-auto p-4 relative bg-white">

                  <div className="absolute inset-0 pt-4 px-4 pb-4">

                    {/* 08:00 */}
                    <div className="flex border-t border-slate-100 h-24">
                      <div className="w-16 flex-shrink-0 pt-2 text-xs font-medium text-slate-400">
                        08:00
                      </div>

                      <div className="flex-grow border-l border-slate-100 relative">

                        <div className="absolute top-4 left-2 right-4 h-16 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-3 flex flex-col justify-center hover:shadow-md cursor-pointer transition-shadow">

                          <div className="flex justify-between items-start">
                            <span className="text-emerald-700 font-bold">
                              Carlos Silva
                            </span>

                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              Avaliação Inicial
                            </span>
                          </div>

                          <span className="text-slate-500 mt-1 text-sm">
                            08:00 - 09:00
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 09:00 */}
                    <div className="flex border-t border-slate-100 h-24">

                      <div className="w-16 flex-shrink-0 pt-2 text-xs font-medium text-slate-400">
                        09:00
                      </div>

                      <div className="flex-grow border-l border-slate-100 relative">

                        {/* Ana */}
                        <div className="absolute top-2 left-2 w-[48%] h-20 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 flex flex-col justify-center hover:shadow-md cursor-pointer transition-shadow">

                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-800">
                              Ana Oliveira
                            </span>
                          </div>

                          <span className="text-slate-500 mt-1 text-sm">
                            09:00 - 10:00 • Pilates
                          </span>
                        </div>

                        {/* Roberto */}
                        <div className="absolute top-6 right-4 w-[48%] h-16 bg-violet-50 border-l-4 border-violet-500 rounded-lg p-3 flex flex-col justify-center hover:shadow-md cursor-pointer transition-shadow">

                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-800">
                              Roberto Alves
                            </span>
                          </div>

                          <span className="text-slate-500 mt-1 text-sm">
                            09:30 - 10:30 • Reabilitação Joelho
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 10:00 */}
                    <div className="flex border-t border-slate-100 h-24">

                      <div className="w-16 flex-shrink-0 pt-2 text-xs font-medium text-slate-400">
                        10:00
                      </div>

                      <div className="flex-grow border-l border-slate-100 relative"></div>
                    </div>

                    {/* 11:00 */}
                    <div className="flex border-t border-slate-100 h-24">

                      <div className="w-16 flex-shrink-0 text-xs font-medium text-slate-400 pt-2">
                        11:00
                      </div>

                      <div className="flex-grow border-l border-slate-100 relative">

                        {/* Cancelado */}
                        <div className="absolute top-0 left-2 right-4 h-16 bg-slate-100 border border-slate-200 rounded-lg p-3 flex flex-col justify-center opacity-60">

                          <div className="flex justify-between items-start">

                            <span className="text-slate-400 line-through font-medium">
                              Mariana Costa
                            </span>

                            <span className="text-xs font-medium text-red-400">
                              Cancelado
                            </span>

                          </div>

                          <span className="text-slate-400 mt-1 text-sm">
                            11:00 - 12:00
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* RESUMO */}
              <div className="lg:col-span-4 xl:col-span-3 rounded-xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm">

                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800">
                    Resumo do Dia
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    4 agendamentos
                  </p>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">

                  {/* Concluído */}
                  <div className="p-3 border border-slate-200 rounded-lg flex gap-3 bg-slate-50/50 opacity-75">

                    <div className="flex flex-col items-center min-w-[40px]">
                      <span className="font-bold text-sm text-slate-500">
                        08:00
                      </span>

                      <div className="w-2 h-2 rounded-full bg-slate-300 mt-1"></div>
                    </div>

                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-slate-700">
                        Carlos Silva
                      </h4>

                      <p className="text-sm text-slate-500">
                        Avaliação Inicial
                      </p>

                      <span className="inline-block mt-2 text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-sm">
                        Concluído
                      </span>
                    </div>
                  </div>

                  {/* Em andamento */}
                  <div className="p-3 border-l-4 border-emerald-500 bg-emerald-50/60 rounded-r-lg flex gap-3 shadow-sm">

                    <div className="flex flex-col items-center min-w-[40px]">
                      <span className="text-emerald-600 font-bold text-sm">
                        09:00
                      </span>

                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 animate-pulse"></div>
                    </div>

                    <div className="flex-grow">

                      <h4 className="text-sm font-bold text-slate-800">
                        Ana Oliveira
                      </h4>

                      <p className="text-sm text-slate-500">
                        Pilates Clínico
                      </p>

                      <span className="inline-block mt-2 text-xs font-medium bg-emerald-600 text-white px-2 py-0.5 rounded-sm">
                        Em Andamento
                      </span>

                    </div>
                  </div>

                  {/* Agendado */}
                  <div className="p-3 border border-slate-200 rounded-lg flex gap-3 hover:border-violet-200 hover:bg-violet-50/30 transition-colors">

                    <div className="flex flex-col items-center min-w-[40px]">

                      <span className="font-bold text-sm text-slate-600">
                        09:30
                      </span>

                      <div className="w-2 h-2 rounded-full bg-violet-400 mt-1"></div>

                    </div>

                    <div className="flex-grow">

                      <h4 className="text-sm font-bold text-slate-800">
                        Roberto Alves
                      </h4>

                      <p className="text-sm text-slate-500">
                        Reabilitação Joelho
                      </p>

                      <span className="inline-block mt-2 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-sm">
                        Agendado
                      </span>

                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
