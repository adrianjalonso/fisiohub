import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";

const itens = [
  { to: "/dashboard", icone: "dashboard", rotulo: "Painel" },
  { to: "/pacientes", icone: "group", rotulo: "Pacientes" },
  { to: "/agenda", icone: "calendar_month", rotulo: "Agenda" },
  { to: "/evolucoes", icone: "add_notes", rotulo: "Evoluções" },
  { to: "/settings", icone: "settings", rotulo: "Configurações" },
];

const estiloBase =
  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const estiloDestacado = `${estiloBase} bg-primary/15 font-semibold text-primary-dark`;
const estiloNormal = `${estiloBase} font-medium text-gray-600 hover:bg-primary/10 hover:text-primary-dark`;

export default function Menu() {
  const { titulo, sobrenome, IdUser } = useUser();

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col justify-between border-r border-green-100 bg-white">
      <div className="flex flex-col gap-8 p-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-md">
            <span className="material-symbols-outlined">ecg_heart</span>
          </div>
          <div className="flex flex-col leading-tight">
            <h1 className="text-xl font-bold tracking-tight text-black">
              FisioHub
            </h1>
            <p className="text-xs font-medium text-gray-500">
              Portal do Fisioterapeuta
            </p>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-1.5" aria-label="Menu principal">
          {itens.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? estiloDestacado : estiloNormal
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -left-6 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"></span>
                  )}
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: `'FILL' ${isActive ? 1 : 0}`,
                    }}
                  >
                    {item.icone}
                  </span>
                  <span>{item.rotulo}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Usuário */}
      <div className="border-t border-green-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <img
            src={`https://api.dicebear.com/10.x/personas/svg?backgroundColor=ff5d8f,ffb703,43aa8b,4d96ff,b57bff&seed=${IdUser}`}
            alt="Foto de perfil"
            className="h-10 w-10 shrink-0 rounded-full bg-white ring-2 ring-white"
          />
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <p className="truncate text-sm font-bold text-black">
              {titulo} {sobrenome}
            </p>
            <p className="truncate text-xs font-medium text-gray-500">
              Fisioterapeuta
            </p>
          </div>
          <NavLink
            to="/login"
            aria-label="Sair"
            title="Sair"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <span className="material-symbols-outlined">logout</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}