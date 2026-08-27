import React, { useState } from "react"
import { Link } from "react-router-dom"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY) 

type LoginProps = {
  setTitulo:React.Dispatch<React.SetStateAction<string>>,
  setSobrenome: React.Dispatch<React.SetStateAction<string>>
  setIdUser: React.Dispatch<React.SetStateAction<number>>
}

export default function Login({setTitulo,setSobrenome,setIdUser}: LoginProps) {
  const [email, setEmail] = useState("")
  async function verificar(){
    const {data,error} = (await supabase.from("users").select("*").eq("user_email",email).single())  
    if(data){
      setTitulo(`${data.titulo} `)
      localStorage.setItem("titulo",data.titulo)
      setSobrenome(data.user_sobrenome)
      localStorage.setItem("sobrenome", data.user_sobrenome)
      setIdUser(data.user_id)
      localStorage.setItem("IdUser", data.user_id)
    } else {
      console.log("supabase error", error)
      console.log("supabase data", data)
      setTitulo("dio error pa ")
    }
  }

  const [visible, setVisible] = useState(false)
  
    const iconVisible = visible ? "visibility" : "visibility_off"

  return(
    <>
      <main className="flex justify-center items-center h-screen w-screen ">
        <section className="flex flex-col justify-center items-center h-screen w-full lg:w-3/5 bg-primary-light" >
          <div className="w-full max-w-[480px] flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <span className="material-symbols-outlined text-4xl">ecg_heart</span>
                <h1 className="text-2xl font-bold tracking-tight text-black">FisioHub</h1>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Login</h2>
              <p className="text-base text-primary">Gerencie seus pacientes e evoluções clinicas de forma eficiente.</p>
            </div>
            <form className="flex flex-col gap-5 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium ">E-mail</label>
                <div className="relative">
                  <span className="absolute flex items-center pl-3 pointer-events-none inset-x-0 inset-y-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                  </span>
                  <input onChange={(e)=>setEmail(e.target.value)} value={email} className="w-full rounded-lg border border-primary. focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 pl-10 pr-4 placeholder:text-primary/50 transition-all" placeholder="seuemail@exemplo.com" type="text" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium ">Senha</label>
                  <a className="text-sm font-medium text-primary hover:text-primary-dark transition-colors" href="">Esqueceu a senha?</a>
                </div>
                <div className="relative">
                  <span className="absolute flex items-center pl-3 pointer-events-none inset-x-0 inset-y-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
                  </span>
                  <input className="w-full rounded-lg border border-primary. focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 pl-10 pr-4 placeholder:text-primary/50 transition-all" placeholder="••••••••" type={visible ? "text": "password"} />
                  <button onClick={()=>setVisible(!visible)} type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-black">
                    <span className="material-symbols-outlined text-primary text-[20px] hover:text-black">{iconVisible}</span>
                  </button>
                </div>
              </div>
              <Link to="/dashboard" onClick={verificar}  className="mt-2 w-full bg-primary shadow-md font-semibold h-12 rounded-lg  flex items-center justify-center text-white" >
                Entrar <span className="material-symbols-outlined mx-2">login</span>
                </Link>
            </form>
            <p  className="flex justify-center text-gray-500" >Não tem uma conta? <Link to="/cadastro" className="text-primary mx-2 hover:underline hover:cursor-pointer">Registre-se aqui</Link></p>
          </div>
        </section>
        <section className=" hidden lg:flex flex-col relative justify-center items-center h-screen w-2/5 overflow-hidden">
          <img className=" object-cover object-center absolute inset-0 w-full h-full bg-cover bg-center " src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIeJZZryymAKbtCjRZUiZng9G9Z2Uecwuyl5fNiqUHJTgDLf6tkbQbifHN7cmG8d0n0Ch60TTSilDFMvYnTftPcsI-BkByTKi6GJ8dZpgWk94j9FKShDk13sQomWfdXv73oAdLsBHw5BVn696BLwQ5rKIZPY-eLA-tlu_dv0pW5LVSAIsUNJ4TofpuCG1Wrvu3qtk8HEPnYgvBWQQI_d5g5SYM--IDhVGVKdMKMXPQq7hvsvcYOlXiLEMhWdGGM0wS-0TE0af781g" alt="Fisio" />
          <div className=" absolute bottom-0 left-0 right-0 z-20 p-12 text-white">
            <div className="max-w-lg">
              <div className="inline-flex items-center justify-center p-2 bg-white/20 backdrop-blur-md rounded-lg mb-6 border border-white/10">
              <span className="material-symbols-outlined">verified_user</span>
              <p className="text-sm font-medium">Plataforma em comformidade com LGPD</p>
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-4">Transformando o cuidado ao paciente através de dados</h2>
              <p className="text-lg text-white/90 font-light leading-relaxed">
              Acesse análises de pacientes em tempo real, acompanhe o progresso da recuperação e gerencie consultas de forma transparente com FisioHub
              </p>
            </div>
            <div className="text-white text-sm font-medium mt-8">
              <p>Criado para fisioterapeutas que querem</p>
              <p className="text-white/70 text-xs">organizar seus atendimentos</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}