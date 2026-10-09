import Menu from "../components/Menu";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function Agenda() {
  const hoje = new Date();

  interface Pacientes {
    id: number;
    nome_paciente: string;
    sobrenome_paciente: string;
    id_user: number;
  }

  interface Agendamentos {
    id: number;
    paciente_id: number;
    data_hora: string;
    tipo: string;
    status: string;
    observacao: string;
    pacientes: Pacientes | null;
  }

  const { IdUser } = useUser();
  const [agendamentos, setAgendamentos] = useState<Agendamentos[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(hoje);

  const dia = dataSelecionada.getDate();
  const mes = dataSelecionada.getMonth() + 1;
  const ano = dataSelecionada.getFullYear();

  const dataDePesquisa =
    ano + "-" + String(mes).padStart(2, "0") + "-" + String(dia).padStart(2, "0");

  const agendamentosDoDia = agendamentos.filter((agendamento) => {
    const dataDoAgendamento = agendamento.data_hora.split("T")[0];
    return dataDoAgendamento === dataDePesquisa;
  });

  useEffect(() => {
    async function carregarAgenda() {
      const { data, error } = await supabase
        .from("agendamentos")
        .select(
          `id,paciente_id,data_hora,tipo,status,observacao,pacientes!inner(id,nome_paciente,sobrenome_paciente,id_user)`
        )
        .eq("pacientes.id_user", IdUser);

      if (error) {
        console.log(error);
        return;
      }

      const dadosFormatados = data.map((item: any) => ({
        ...item,
        pacientes: Array.isArray(item.pacientes)
          ? item.pacientes[0]
          : item.pacientes,
      }));

      setAgendamentos(dadosFormatados);
    }

    carregarAgenda();
  }, [IdUser]);

  const horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div className="h-screen overflow-hidden flex flex-row bg-slate-50">
      <Menu />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-100/60 to-transparent pointer-events-none"></div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 z-10 scroll-smooth">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
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

                <button className="flex-1 md:flex-none items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25 transition-all flex gap-2 min-w-[180px]">
                  <span className="material-symbols-outlined">add</span>
                  Novo Agendamento
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-gap-lg h-[calc(100vh-12rem)]">
              <div className="lg:col-span-8 xl:col-span-9 rounded-xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        const novaData = new Date(dataSelecionada);
                        novaData.setDate(novaData.getDate() - 1);
                        setDataSelecionada(novaData);
                      }}
                      className="p-2 rounded-full transition-colors text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </button>

                    <h3 className="font-bold text-lg text-slate-800">
                      {dataSelecionada.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>

                    <button
                      onClick={() => {
                        const novaData = new Date(dataSelecionada);
                        novaData.setDate(novaData.getDate() + 1);
                        setDataSelecionada(novaData);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-700"
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const dataDehoje = new Date(hoje);
                      setDataSelecionada(dataDehoje);
                    }}
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                  >
                    Hoje
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 relative bg-white">
                  <div className="absolute inset-0 pt-4 px-4 pb-4">
                    {horarios.map((hora) => {
                      const agendamentosDaHora = agendamentosDoDia.filter(
                        (a) => {
                          const horaAgendamento = a.data_hora
                            .split("T")[1]
                            ?.substring(0, 5);
                          return horaAgendamento === hora;
                        }
                      );

                      return (
                        <div
                          key={hora}
                          className="flex border-t border-slate-100 h-24"
                        >
                          <div className="w-16 flex-shrink-0 pt-2 text-xs font-medium text-slate-400">
                            {hora}
                          </div>

                          <div className="flex-grow border-l border-slate-100 relative p-1">
                            {agendamentosDaHora.map((agendamento) => {
                              const nomePaciente = agendamento.pacientes
                                ? `${agendamento.pacientes.nome_paciente} ${agendamento.pacientes.sobrenome_paciente}`
                                : "Paciente desconhecido";

                              const isCancelado =
                                agendamento.status === "Cancelado";

                              return (
                                <div
                                  key={agendamento.id}
                                  className={`absolute top-2 left-2 right-4 h-16 border-l-4 rounded-lg p-3 flex flex-col justify-center hover:shadow-md cursor-pointer transition-shadow ${
                                    isCancelado
                                      ? "bg-slate-100 border-slate-300 opacity-60"
                                      : "bg-emerald-50 border-emerald-500"
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <span
                                      className={`font-bold ${
                                        isCancelado
                                          ? "text-slate-400 line-through"
                                          : "text-emerald-700"
                                      }`}
                                    >
                                      {nomePaciente}
                                    </span>

                                    <span
                                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        isCancelado
                                          ? "text-red-400 bg-red-50"
                                          : "bg-emerald-100 text-emerald-700"
                                      }`}
                                    >
                                      {agendamento.tipo}
                                    </span>
                                  </div>

                                  <span
                                    className={`mt-1 text-sm ${
                                      isCancelado
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {agendamento.observacao || agendamento.status}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 xl:col-span-3 rounded-xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800">Resumo do Dia</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {agendamentosDoDia.length} agendamento(s)
                  </p>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {agendamentosDoDia.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">
                      Nenhum agendamento para este dia.
                    </p>
                  ) : (
                    agendamentosDoDia.map((agendamento) => {
                      const horaFormatada =
                        agendamento.data_hora.split("T")[1]?.substring(0, 5) ||
                        "";
                      const nomePaciente = agendamento.pacientes
                        ? `${agendamento.pacientes.nome_paciente} ${agendamento.pacientes.sobrenome_paciente}`
                        : "Paciente desconhecido";

                      return (
                        <div
                          key={agendamento.id}
                          className="p-3 border border-slate-200 rounded-lg flex gap-3 bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                        >
                          <div className="flex flex-col items-center min-w-[40px]">
                            <span className="font-bold text-sm text-slate-600">
                              {horaFormatada}
                            </span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1"></div>
                          </div>

                          <div className="flex-grow">
                            <h4 className="text-sm font-bold text-slate-800">
                              {nomePaciente}
                            </h4>

                            <p className="text-sm text-slate-500">
                              {agendamento.tipo}
                            </p>

                            <span className="inline-block mt-2 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                              {agendamento.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}