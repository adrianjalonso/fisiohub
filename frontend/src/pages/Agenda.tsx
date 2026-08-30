import Menu from "../components/Menu";
import { Link } from "react-router-dom";

export default function Agenda(){
  return(
    <div className="h-screen overflow-hidden flex flex-row">
    <Menu />
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
              <span>Agenda</span>
            </nav>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                  Agenda
                </h2>
                <p className="text-base max-w-xl">
                  Gerencie seus horários e atendimentos.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex border rounded-lg p-1">
                  <button className="px-3 py-1.5 rounded  font-label-sm bg-primary-container text-on-primary-container">Dia</button>
                  <button className="px-3 py-1.5 rounded text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors">Semana</button>
<button className="px-3 py-1.5 rounded text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors">Mês</button>
                </div>
                <button className="flex-1 md:flex-none items-center justify-center px-6 py-3 rounded-lg bg-primary text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex gap-2 min-w-[180px]">
<span className="material-symbols-outlined" >add</span>
                    Novo Agendamento
                </button>
              </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-gap-lg h-[calc(100vh-12rem)]">
              <div className="lg:col-span-8 xl:col-span-9 rounded-xl border flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<h3 className="font-headline-md text-body-lg">15 de Novembro, 2023</h3>
<button className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">chevron_right</span>
</button>
                  </div>
                  <button className=" text-primary transition-colors">Hoje</button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 relative">
                  <div className="absolute inset-0 pt-4 px-4 pb-4">
                    <div className="flex border-t h-24">
                    <div className="w-16 flex-shrink-0 pt-2">08:00</div>
                    <div className="flex-grow border-l  relative">
                      <div className="absolute top-4 left-2 right-4 h-16 bg-status-info-bg border border-primary/20 rounded-lg p-3 flex flex-col justify-center hover:shadow-sm cursor-pointer transition-shadow">
                      <div className="flex justify-between items-start">
                        <span className=" text-primary font-bold">Carlos Silva</span>
                        <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">Avaliação Inicial</span>
                      </div>
                      <span className=" text-text-secondary mt-1">08:00 - 09:00</span>
                      </div>
                    </div>
                    </div>
                    <div className="flex border-t h-24">
                    <div className="w-16 flex-shrink-0  pt-2">09:00</div>
                    <div className="flex-grow border-l relative">
                    <div className="absolute top-2 left-2 w-[48%] h-20 bg-tertiary-container/20 border rounded-lg p-3 flex flex-col justify-center hover:shadow-sm cursor-pointer transition-shadow">
                    <div className="flex justify-between items-start">
<span className="font-bold">Ana Oliveira</span>
</div>
<span className=" mt-1">09:00 - 10:00 • Pilates</span>
                    </div>
                    <div className="absolute top-6 right-4 w-[48%] h-16  border rounded-lg p-3 flex flex-col justify-center hover:shadow-sm cursor-pointer transition-shadow">
                      <div className="flex justify-between items-start">
<span className="font-bold">Roberto Alves</span>
</div>
<span className=" mt-1">09:30 - 10:30 • Reabilitação Joelho</span>
                    </div>
                    </div>
                    </div>
                    <div className="flex border-t h-24">
<div className="w-16 flex-shrink-0 pt-2">10:00</div>
<div className="flex-grow border-l  relative">
</div>
</div>
<div className="flex border-t border-border-light/50 h-24">
<div className="w-16 flex-shrink-0 text-label-xs font-label-xs text-text-secondary pt-2">11:00</div>
<div className="flex-grow border-l border-border-light/50 relative">
<div className="absolute top-0 left-2 right-4 h-16 bg-surface-container-highest border border-outline-variant rounded-lg p-3 flex flex-col justify-center opacity-60">
<div className="flex justify-between items-start">
<span className="text-on-surface-variant line-through">Mariana Costa</span>
<span className="">Cancelado</span>
</div>
<span className=" mt-1">11:00 - 12:00</span>
</div>
</div>
</div>
                  </div>

                </div>
              </div>
              <div className="lg:col-span-4 xl:col-span-3 rounded-xl border flex flex-col overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,110,39,0.05)]">
<div className="p-4 border-b ">
<h3 className=" font-bold">Resumo do Dia</h3>
<p className=" mt-1">4 agendamentos</p>
</div>
<div className="flex-grow overflow-y-auto p-4 space-y-4">
<div className="p-3 border rounded-lg flex gap-3 opacity-75">
<div className="flex flex-col items-center min-w-[40px]">
<span className="font-bold">08:00</span>
<div className="w-2 h-2 rounded-full bg-outline-variant mt-1"></div>
</div>
<div className="flex-grow">
<h4 className=" font-bold">Carlos Silva</h4>
<p className="">Avaliação Inicial</p>
<span className="inline-block mt-2 text-on-surface-variant px-2 py-0.5 rounded-sm">Concluído</span>
</div>
</div>
<div className="p-3 border-l-4 border-primary rounded-r-lg flex gap-3 shadow-sm">
<div className="flex flex-col items-center min-w-[40px]">
<span className=" text-primary font-bold">09:00</span>
<div className="w-2 h-2 rounded-full bg-primary mt-1 animate-pulse"></div>
</div>
<div className="flex-grow">
<h4 className=" font-bold">Ana Oliveira</h4>
<p className="">Pilates Clínico</p>
<span className="inline-block mt-2 font-label-xs text-label-xs bg-primary text-on-primary px-2 py-0.5 rounded-sm">Em Andamento</span>
</div>
</div>
<div className="p-3 border  rounded-lg flex gap-3">
<div className="flex flex-col items-center min-w-[40px]">
<span className=" font-bold">09:30</span>
<div className="w-2 h-2 rounded-full mt-1"></div>
</div>
<div className="flex-grow">
<h4 className=" font-bold">Roberto Alves</h4>
<p className="">Reabilitação Joelho</p>
<span className="inline-block mt-2  px-2 py-0.5 rounded-sm border ">Agendado</span>
</div>
</div>
</div>
</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}