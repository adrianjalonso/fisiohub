import { Link } from "react-router-dom"
import { createClient } from "@supabase/supabase-js"
import {  useState } from "react"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY)


export default function Registro ({IdUser}: {IdUser: number}) {
  const [nomeNovoPaciente,setNomeNovoPaciente] = useState("")
  const [DataDeNascimento, setDataDeNascimento] = useState("")
  const [idade,setIdade] = useState(0)
  const [emailPaciente, setEmailPaciente] = useState("")
  const [telefone,setTelefone] = useState("")
  const [endereco,setEndereco] = useState("")
  const [genero,setGenero] = useState("")

  function formatarTelefone(valor:string){
    valor = valor.replace(/\D/g,"")

    valor = valor.slice(0,11)
    if(valor.length<=2){
      return valor
    }

    if(valor.length<=7){
      return `(${valor.slice(0,2)})${valor.slice(2)}`;
    }

    return `(${valor.slice(0,2)})${valor.slice(2,7)}-${valor.slice(7)}`
  }

  const telefoneSemFormatar = telefone.replace(/\D/g,"")
  
  async function registrar(e: any){
    e.preventDefault()
    const {data,error} = await supabase.from("pacientes").insert({nome_paciente: nomeNovoPaciente,data_nascimento: DataDeNascimento,idade: idade,email: emailPaciente, telefone: telefoneSemFormatar, endereco: endereco,id_user: IdUser,genero: genero})

    if (error) {
      console.error(error)
    } else{
      console.log("Paciente cadastrado!",data)
    }
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
      <main className="flex-grow h-full flex flex-col overflow-scroll items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[800px] flex flex-col gap-6">
          <nav className="flex items-center text-sm font-medium">
            <Link to="/dashboard" className="text-gray-500 hover:text-primary transition-colors">Painel</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/pacientes" className="text-gray-500 hover:text-primary transition-colors">Pacientes</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary font-semibold">Novo paciente</span>
          </nav>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Cadastro de pacientes</h1>
            <p className="text-gray-500 text-base">Insira os detalhes abaixo para cadastrar um novo paciente para acompanhamento clínico e gestão de evoluções.</p>
          </div>
          <form className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 md-6">
                <span className="flex items-center justify-center size-8 rounded-full bg-green-50 text-primary">
                  <span className="material-symbols-outlined">person</span>
                </span>
                <h3 className="text-lg font-bold">Informações pessoais</h3>
              </div>
              <div className=" grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Nome completo</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">badge</span>
                    <input onChange={(e)=>setNomeNovoPaciente(e.target.value)}  className="w-full rounded-lg border-gray-200 bg-gray-50 pl-11 pr-4 py-3 placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all" placeholder="ex: Maria Silva" type="text" />
                  </div>
                </div>
                <div className="  grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className=" md:col-span-1 flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Data de nascimento</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">calendar_month</span>
                      <input onChange={(e)=>{setDataDeNascimento(e.target.value);setIdade(calcularIdade(e.target.value))}}  className="w-full rounded-lg border-gray-200 bg-gray-50 pl-11 pr-4 py-3 placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all" type="date" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Gênero</label>
                    <div className="relative">
                      <span className="text-[20px] absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">person</span>
                      <select onChange={(e)=>setGenero(e.target.value)} className="w-full rounded-lg border-gray-200 bg-gray-50 pl-11 pr-10 py-3 focus:border-primary focus:ring-primary sm:text-sm transition-all appearance-none">
                        <option value="">Selecione</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Idade</label>
                    <div className="relative">
                      <div className="w-full rounded-lg border-transparent bg-gray-100 px-4 py-3 text-center text-gray-500 font-medium sm: text-sm cursor-not-allowed"><p>{idade}</p></div> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center size-8 rounded-full bg-green-50 text-primary">
                  <span className="material-symbols-outlined text-xl">contact_phone</span>
                </span>
                <h3 className="text-lg font-bold">Detalhes de contato</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">E-mail</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">mail</span>
                    <input onChange={(e)=>setEmailPaciente(e.target.value)} className="w-full rounded-lg border-gray-200 bg-gray-50 pl-11 pr-4 py-3 placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all" placeholder="maria@exemplo.com" type="email" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">call</span>
                    <input onChange={(e)=>setTelefone(formatarTelefone(e.target.value))} className="w-full rounded-lg border-gray-200 bg-gray-50 pl-11 pr-4 py-3 placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all" placeholder="(11) 99999-9999" type="tel" value={telefone} />
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Endereço</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">home</span>
                    <input onChange={(e)=> setEndereco(e.target.value)} className="w-full rounded-lg border-gray-200 bg-gray-50 pl-11 pr-4 py-3 placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all" placeholder="Av. Paulista, 1000 São Paulo, SP" type="text" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center size-8 rounded-full bg-green-50 text-primary">
                  <span className="material-symbols-outlined text-xl">medical_services</span>
                </span>
                <h3 className="text-lg font-bold">Anamnese</h3>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-sm font-medium tetx-gray-700 ">Motivo da Fisioterapia</label>
                  <span className="text-sm text-gray-400 italic">Por favor, inclua os principais sintomas e a duração</span>
                </div>
                <textarea className="w-full rounded-lg border-gray-200 bg-gray-50 p-4 placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all resize-none" placeholder="Descreva a queixa principal do paciente, histórico de lesões e quaisquer detalhes relevantes... " rows={6}></textarea>
              </div>
            </div>
            <div className="px-6 py-4 md:px-8 md-py-6 bg-gray-50 flex justify-end items-center gap-4 border-t border-gray-100">
              <button className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors" type="button">
                Cancelar
                </button>
                <button onClick={registrar} className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-black text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2" type="submit">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  Salvar cadastro
                </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}