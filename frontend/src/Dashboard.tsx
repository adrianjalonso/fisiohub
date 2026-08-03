import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import type { Agendamento } from "./types/types";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

type DashboardProps = {
  titulo: string;
  sobrenome: string;
  IdUser: number
};

export default function Dashboard({ titulo, sobrenome, IdUser }: DashboardProps) {
  const hoje = new Date();
  const dia = hoje.getDate();
  const mesNum = hoje.getMonth();
  const ano = hoje.getFullYear();
  const hora = hoje.getHours();
  let meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // Inicio da semana
  const inicioSemana = new Date(hoje);
  const primerDia = inicioSemana.getDay();
  const diferenca = primerDia === 0 ? 6:primerDia-1;
  inicioSemana.setDate(inicioSemana.getDate()-diferenca);
  inicioSemana.setHours(0,0,0,0);

  // Fim da semana
  const fimSemana =new Date(inicioSemana);
  fimSemana.setDate(fimSemana.getDate()+6);
  fimSemana.setHours(23,59,59,999);

  //Semana passada
  const inicioSemanaPassada = new Date(inicioSemana);
  inicioSemanaPassada.setDate(inicioSemanaPassada.getDate()-7)

  const fimSemanaPassada = new Date(fimSemana);
  fimSemanaPassada.setDate(fimSemanaPassada.getDate()-7)

  const mes = meses[mesNum];
  let saudacao;

  if (hora < 12) {
    saudacao = "Bom dia";
  } else if (hora < 18) {
    saudacao = "Boa tarde";
  } else {
    saudacao = "Boa noite";
  }

  const [atendimentosHoje, setAtendimentosHoje] = useState(0);
  const [agendamentosHoje, setAgendamentosHoje] = useState<Agendamento[]>([]);
  const [comparacao, setComparacao] = useState("")
  const [totalPacientes,setTotalPacientes] = useState(0)
  const [ComparacaoPacientes, setComparacaoPacientes] = useState("")
  
  

  useEffect(() => {

    if (!IdUser) return;

    async function carregarDados() {
      const inicioHoje = new Date();
      inicioHoje.setHours(0, 0, 0, 0);

      const fimHoje = new Date();
      fimHoje.setHours(23, 59, 59, 999);

      const ontemInicio = new Date(inicioHoje);
      ontemInicio.setDate(ontemInicio.getDate() - 1);

      const ontemFim = new Date(fimHoje);
      ontemFim.setDate(ontemFim.getDate() - 1);

      const { count: hojeCount } = await supabase
        .from("agendamentos")
        .select("*", { count: "exact", head: true })
        .gte("data_hora", inicioHoje.toISOString())
        .lte("data_hora", fimHoje.toISOString());

      const { count: ontemCount } = await supabase
        .from("agendamentos")
        .select("*", { count: "exact", head: true })
        .gte("data_hora", ontemInicio.toISOString())
        .lte("data_hora", ontemFim.toISOString());

      const hoje = hojeCount||0;
      const ontem = ontemCount || 0;


      if(hoje>ontem){
        setComparacao(`${hoje-ontem} a mais que ontem`)
      } else if (hoje<ontem){
        setComparacao(`${ontem-hoje} a menos que ontem`)
      } else {
        setComparacao("Mesmo número de atendimentos que ontem ")
      }

      const { data, error } = await supabase
        .from("agendamentos")
        .select("*,pacientes(nome_paciente,sobrenome_paciente)")
        .gte("data_hora", inicioHoje.toISOString())
        .lte("data_hora", fimHoje.toISOString())
        .order("data_hora", { ascending: true });

        const {count: pacientesCount,error:pacientesError} = await supabase.from("pacientes").select("*",{count: "exact", head: true}).eq("id_user",IdUser);

        if (pacientesError){
          console.error(pacientesError)
          return
        }
        setTotalPacientes(pacientesCount||0)

      const {count: estaSemana} = await supabase.from("pacientes").select("*",{count:"exact",head:true})
      .gte("created_at",inicioSemana.toISOString()).lte("created_at",fimSemana.toISOString())

      const {count:semanaPassada} = await supabase.from("pacientes").select("*",{count: "exact",head: true})
      .gte("created_at",inicioSemanaPassada.toISOString()).lte("created_at",fimSemanaPassada.toISOString())

      const atual = estaSemana||0;
      const anterior = semanaPassada||0

      if (atual>anterior){
        setComparacaoPacientes(`+${atual-anterior} novos esta semana`)
      } else if (atual<anterior){
        setComparacaoPacientes(`${anterior-atual} a menos que na semana passada`)
      } else {
        setComparacaoPacientes("Mesmo número de novos pacientes da semana passada")
      }

      if (error) {
        console.error(error);
        return;
      }
      setAtendimentosHoje(hoje);
      setAgendamentosHoje(data || []);
    }
    carregarDados();
  }, [IdUser]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
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
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-primary-dark transition-colors  bg-primary/30"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p>Painel</p>
            </Link>
            <Link
              to="/pacientes"
              className="flex items-center gap-3 rounded-lg hover:bg-primary-light/50 px-4 py-3 text-sm font-medium text-primary-dark transition-colors hover:bg-gray-300"
            >
              <span className="material-symbols-outlined">group</span>
              <p>Pacientes</p>
            </Link>
            <Link
              to="/dashboard"
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
                {saudacao} {titulo}  {sobrenome}
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
      <main className="flex flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-green-100 bg-white/80 px-8 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <span className="material-symbols-outlined">calendar_today</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight ">
              {dia} de {mes}, {ano}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden w-80 md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                className="h-10 w-full rounded-lg border-none bg-gray-50 pl-10 pr-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Buscar pacientes, condições..."
              />
            </div>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition hover:bg-gray-100 hover:text-primary">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>
        <div className="flex flex-col gap-8 p-8 bg-primary/10">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight">
              {saudacao}, {titulo} {sobrenome}
            </h2>
            <p className="">Aqui está seu resumo diário e tarefas.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-xl p-6 transition-all hover:shadow-lg bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium">Atendimentos hoje</p>
                  <h3 className="text-4xl font-bold ">{atendimentosHoje}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                  <span className="material-symbols-outlined">
                    event_available
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary-dark">
                <span className="material-symbols-outlined">trending_up</span>
                <p>{comparacao}</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl p-6 transition-all hover:shadow-lg bg-white">
              <div className="absolute right-0 top-0 h-full w-1 bg-amber-400"></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium ">
                    Evoluções pendentes
                  </p>
                  <h3 className="text-4xl font-bold ">0</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 ">
                  <span className="material-symbols-outlined">edit_note</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-600">
                <span className="material-symbols-outlined text-sm">
                  priority_high
                </span>
                <p>Ação necessária</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl p-6 transition-all hover:shadow-lg bg-white">
              <div className="absolute right-0 top-0 h-full w-1 bg-amber-400"></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium ">
                    Total de pacientes
                  </p>
                  <h3 className="text-4xl font-bold ">{totalPacientes}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500 ">
                  <span className="material-symbols-outlined">diversity_1</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                <p>{ComparacaoPacientes}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-xl p-6 shadow-md bg-white lg:col-span-2">
              <div className="flex items-center justify-between ">
                <h3 className="text-lg font-bold">Agenda de hoje</h3>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Novo atendimento
                </button>
              </div>
              <div className="flex flex-col gap-3 ">
                {agendamentosHoje.map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 px-3 py-2 text-primary-dark">
                        <p className="text-xs font-bold uppercase">Hoje</p>

                        <p className="text-lg font-bold">
                          {new Date(agendamento.data_hora).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <h4 className="font-bold">
                          {agendamento.pacientes?.nome_paciente}{" "}
                          {agendamento.pacientes?.sobrenome_paciente}
                        </h4>

                        <p className="text-sm">
                          {agendamento.tipo} • {agendamento.observacao}
                        </p>
                      </div>
                    </div>

                    <div className="hidden items-center gap-3 sm:flex">
                      <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Evoluções pendentes</h3>
                <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600">
                  3
                </span>
              </div>
              <p className="text-sm">
                Anotações das sessões de ontem que precisam ser concluídas.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 rounded-lg border border-amber-100 bg-amber50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWcwy6nONP8Lwm4euJw8-KIv-sPJYE5e_2oIRNY3M75sq11JtWON1FRanaDGhAka6uz6-598ZxCsGRzZWT0kaMTQ4O5RTzup6DH1M-_acxA3ySxDaiAb3Pl5CMnNYjSxgAFi5mhrwdlFXpZS8oDnETVMzoifwmzdyW5XMqUV5xgAXrZ3I86vTRNWUm1co10wSObr1hnO3Xk9gEp3hGWjqZYPGfKtD2MO9_YUzntMKdjnx940ba2QLn_f41ubK45aq0aotdTC4jZyQ"
                        className="size-8 rounded-full bg-cover bg-center"
                      />
                      <p className="font-medium ">Cameron W.</p>
                    </div>
                    <p className="text-xs ">Ontem, 14:00</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="rounded bg-gray-100 px-2 py-1 text-xs font-medium shadow-sm">
                      Dor no pescoço
                    </p>
                    <button className="flex items-center gap-1 text-xs font-bold text-primary-dark hover:underline">
                      Completar nota{" "}
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-lg border border-amber-100 bg-amber50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBReCe0G64R-38bU0pEAVFwahoOXZlVu81Si-9yfBhY0tZ9BxOyPv3JT2y8qypIXUL7sGrhT1Wpo5-eL_PTsF8S1lyocMrwSvSgRBNS-MGBvvSwbFqlQXb2neTH_gY7gC_EUQhHf2nGo13LSH8ej0q7NpTW6B4426KT7I2SRas6qJYS8Bc6fY_8ZtROgyj0JpIK7Lzx0kQMW5dD4Je1TtmheAgMtMuVSjVGYGl1EGxL219GtYAMWtOERkPTg9r8fgXiIOi4iJuBKM4"
                        className="size-8 rounded-full bg-cover bg-center"
                      />
                      <p className="font-medium ">Esther Howard</p>
                    </div>
                    <p className="text-xs ">Ontem, 16:30</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="rounded bg-gray-100 px-2 py-1 text-xs font-medium shadow-sm">
                      Distensão lombar
                    </p>
                    <button className="flex items-center gap-1 text-xs font-bold text-primary-dark hover:underline">
                      Completar nota{" "}
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-lg border border-amber-100 bg-amber50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-qvnL-sbLyJ1jkkuTfcSZstIytTIb6bsm6ngplh648fhYKqRHT3acZOkASeAU_ogq_uGVm5EYlD0v2P3ibgSTLPDJYbjboHQlnFF7kSyMrL7ZreYSIUX9phCB23t-KUbHQ2AsDP41aMAJrlCJuE9TB3mBfmGD5HJpR0JX35zccFxmEdC9Xoxb1eGbJyyfwlwYJBYuzS7EfHmcvMdpbxUVvN_aax2mSdV4QXd6hOLol9h6drCgiCt1c18H9kFL6G33X9-xQ-WTXZo"
                        className="size-8 rounded-full bg-cover bg-center"
                      />
                      <p className="font-medium ">Marvin M.</p>
                    </div>
                    <p className="text-xs ">Ontem, 17:00</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="rounded bg-gray-100 px-2 py-1 text-xs font-medium shadow-sm">
                      Acompanhamento
                    </p>
                    <button className="flex items-center gap-1 text-xs font-bold text-primary-dark hover:underline">
                      Completar nota{" "}
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <button className="mt-2 w-full rounded-lg border border-dashed border-gray-300 py-2 text-sm font-medium transition hover:border-primary hover:text-primary">
                Ver todas as tarefas pendentes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
