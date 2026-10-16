import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function Pacientes() {
  interface Pacientes {
    id: number;
    nome_paciente: string;
    sobrenome_paciente: string;
    id_user: number;
    genero: string;
    status:string;
    data_nascimento: string
  }

  function calcularIdade(dataDeNascimento: string) {
    const hoje = new Date();
    const nascimento = new Date(dataDeNascimento);
    let idade = hoje.getFullYear()-nascimento.getFullYear()

    const mesAtual= hoje.getMonth()
    const diaAtual= hoje.getDate()

    const mesNascimento = nascimento.getMonth()
    const diaNascimento = nascimento.getDate()

    if (mesAtual<mesNascimento||(mesAtual===mesNascimento&&diaAtual<diaNascimento)){
      idade--
    }
    return idade;
  }



  const {IdUser}= useUser()
  const [totalPacientes, setTotalPacientes] = useState(0)
  const [pacientes, setPacientes] = useState<Pacientes[]>([])
  const [pacientesAtivos, setPacientesAtivos] = useState(0)

  
  

  useEffect(()=>{
    async function carregarPacientes(){
      const {count:listaPacientes,error:errorLista} = await supabase.from("pacientes").select("*",{count:"exact", head: true}).eq("id_user",IdUser)

      if (listaPacientes) {
        setTotalPacientes(listaPacientes||0)
      } else{
        console.log(errorLista)
      }

      const {data,error} = await supabase.from("pacientes").select("*").eq("id_user",IdUser)

      if (data){
        setPacientes(data)
      } else {
        console.log(error)
      }

      const {count: pacientesAtivos,error: pacientesAtivosError} = await supabase.from("pacientes").select("*",{count: "exact",head: true}).eq("id_user",IdUser).eq("status","Tratamento ativo")

      if (pacientesAtivos){
        setPacientesAtivos(pacientesAtivos)
      } else {
        console.log(pacientesAtivosError)
      }
    }

    carregarPacientes()
  },[IdUser])


  return (
    <div className="h-screen overflow-hidden flex flex-row">
      <Menu />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-100/60 to-transparent pointer-events-none"></div>
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
                  <span className="text-2xl font-bold">{totalPacientes}</span>
                </div>
                <div className="flex flex-col items-end px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Ativos hoje
                  </span>
                  <span className="text-2xl font-bold text-primary">{pacientesAtivos}</span>
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
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ">
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
                    {pacientes.map((paciente) => (
  <tr
    key={paciente.id}
    className="hover:bg-primary/5 transition-colors cursor-pointer"
  >
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
          src={`https://api.dicebear.com/10.x/personas/svg?seed=${paciente.id}`}
          alt={paciente.nome_paciente}
        />

        <div className="flex flex-col">
          <span className="font-bold text-base">
            {paciente.nome_paciente} {paciente.sobrenome_paciente}
          </span>

          <span className="text-xs text-primary/90">
            ID: #{paciente.id}
          </span>
        </div>
      </div>
    </td>

    <td className="py-4 px-6 align-middle">
      <div className="text-sm">
        {`${calcularIdade(paciente.data_nascimento)} anos` || "Não informado"}
      </div>
        <div className="text-xs">
        {paciente.genero || "Não informado"}
      </div>
    </td>

    <td className="py-4 px-6 align-middle">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">
          person
        </span>

        <span className="text-sm font-medium">
          Paciente cadastrado
        </span>
      </div>
    </td>

    <td className="py-4 px-6 align-middle">
      <span className={`${paciente.status=== "Tratamento ativo" ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800":"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"} `}>
        <span className={`${paciente.status=== "Tratamento ativo" ? "w-1.5 h-1.5 rounded-full bg-green-600":"w-1.5 h-1.5 rounded-full bg-gray-500"} `} />
        <span className="" />
        {paciente.status}
      </span>
    </td>

    <td className="py-4 px-6 align-middle text-right">
      <button
        type="button"
        className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100"
      >
        <span className="material-symbols-outlined">
          more_vert
        </span>
      </button>
    </td>
  </tr>
))}
                  </tbody>
                </table>
              </div>
              <div className="mt-auto border-t border-gray-100 px-6 py-4 flex flex-col md:flex-row items-center justify-center gap-4">
                <p className="text-sm">
                  Mostrando <span className="font-medium">1-5</span> de <span className="font-medium">{totalPacientes}</span> pacientes
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
