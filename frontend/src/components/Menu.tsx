import { NavLink } from "react-router-dom"
import { useUser } from "../context/UserContext"

export default function Menu(){
  const {titulo,sobrenome,IdUser} = useUser()

  

  const estiloDestacado = "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-primary-dark transition-colors  bg-primary/30"
  const estiloNormal = "flex items-center gap-3 rounded-lg hover:bg-primary/30 px-4 py-3 text-sm font-medium text-primary-dark transition-colors hover:bg-gray-300"

  return (
    <>
    <aside className="flex h-full w-72 flex-col justify-between border-r border-green-100 transition-colors duration-200">
        <div className="flex flex-col gap-8 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md">
              <span className="material-symbols-outlined">
                ecg_heart
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
            <NavLink
              to="/dashboard"
              className={({isActive})=>
              isActive ? estiloDestacado: estiloNormal
              }
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p>Painel</p>
            </NavLink>
            <NavLink
              to="/pacientes"
              className={({isActive})=>
              isActive ? estiloDestacado: estiloNormal
              }
            >
              <span className="material-symbols-outlined">group</span>
              <p>Pacientes</p>
            </NavLink>
            <NavLink
              to="/agenda"
              className={({isActive})=>
              isActive ? estiloDestacado: estiloNormal
              }
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <p>Agenda</p>
            </NavLink>
            <NavLink
              to="/evolucoes"
              className={({isActive})=>
              isActive ? estiloDestacado: estiloNormal
              }
            >
              <span className="material-symbols-outlined">add_notes</span>
              <p>Evoluçoes</p>
            </NavLink>
            <NavLink
              to="/settings"
              className={({isActive})=>
              isActive ? estiloDestacado: estiloNormal
              }
            >
              <span className="material-symbols-outlined">settings</span>
              <p>Configurações</p>
            </NavLink>
          </nav>
        </div>
        <div className="border-t border-green-100 p-6 ">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/10.x/personas/svg?backgroundColor=ff5d8f,ffb703,43aa8b,4d96ff,b57bff&seed=${IdUser}`}
              className="h-10 w-10 rounded-full bg-cover bg-center ring-2 ring-white"
            ></img>
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="truncate text-sm font-bold text-black">
               {titulo} {sobrenome}
              </p>
              <p className="truncate text-xs font-bold">Fisioterapeuta</p>
            </div>
            <NavLink
              to="/login"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  )
}