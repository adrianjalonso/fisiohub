import Menu from "../components/Menu";
import { Link } from "react-router-dom";

export default function NovaEvolucao () {
  return(
   <div className="h-screen overflow-hidden flex flex-row">
      <Menu />
      <main className="flex-grow h-full flex flex-col overflow-scroll items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[800px] flex flex-col gap-6">
          <nav className="flex items-center text-sm font-medium">
            <Link to="/dashboard" className="text-gray-500 hover:text-primary transition-colors">Painel</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/evolucoes" className="text-gray-500 hover:text-primary transition-colors">Evoluçoes</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary font-semibold">Nova evolução</span>
          </nav>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Nova evolução</h1>
          </div>
          <form className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100 ">
              <div className=" grid grid-cols-1 gap-6 ">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Paciente:</label>
                </div>
                <select >
                  <option value="">Selecione um paciente...</option>
                  <option value="">teste</option>
                  <option value="">teste2</option>
                </select>
              </div>
              
            </div>
            <div className="px-6 py-4 md:px-8 md-py-6 bg-gray-50 flex justify-end items-center gap-4 border-t border-gray-100">
              <button className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors" type="button">
                Cancelar
                </button>
                <button  className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-black text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2" type="submit">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  Salvar evolução
                </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}