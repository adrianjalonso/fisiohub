import Menu from "../components/Menu";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

interface Paciente {
  id: number;
  nome_paciente: string;
  sobrenome_paciente: string;
  id_user: number;
}

export default function NovoAgendamento() {
  const { IdUser } = useUser();
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState("");
  const [tipo, setTipo] = useState("Atendimento");
  const [data, setData] = useState(
    new Date().toLocaleDateString("pt-BR")
  );
  const [hora, setHora] = useState("09:00");
  const [observacao, setObservacao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPacientes() {
      if (!IdUser) return;

      const { data, error } = await supabase
        .from("pacientes")
        .select(
          "id, nome_paciente, sobrenome_paciente, id_user"
        )
        .eq("id_user", IdUser)
        .order("nome_paciente");

      if (error) {
        console.error("Erro ao carregar pacientes:", error);
        setErro("Não foi possível carregar os pacientes.");
        return;
      }

      setPacientes(data ?? []);
    }

    carregarPacientes();
  }, [IdUser]);

  async function salvarAgendamento(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setErro("");

    if (!pacienteId || !data || !hora || !tipo) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);

    const dataHora = `${data}T${hora}:00`;

    const { error } = await supabase
      .from("agendamentos")
      .insert({
        paciente_id: Number(pacienteId),
        data_hora: dataHora,
        tipo,
        status: "Agendado",
        observacao: observacao.trim(),
      });

    setSalvando(false);

    if (error) {
      console.error("Erro ao salvar agendamento:", error);
      setErro("Não foi possível salvar. Verifique os dados e tente novamente.");
      return;
    }

    navigate("/agenda");
  }

  return (
    <div className="h-screen overflow-hidden flex flex-row bg-slate-50">
      <Menu />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-100/60 to-transparent pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 z-10">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <nav className="flex items-center text-sm font-medium text-slate-500">
              <Link
                to="/dashboard"
                className="hover:text-emerald-600 transition-colors"
              >
                Painel
              </Link>

              <span className="mx-2 text-slate-300">/</span>

              <Link
                to="/agenda"
                className="hover:text-emerald-600 transition-colors"
              >
                Agenda
              </Link>

              <span className="mx-2 text-slate-300">/</span>

              <span className="text-slate-800">
                Novo Agendamento
              </span>
            </nav>

            <header className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <span className="material-symbols-outlined text-3xl">
                  calendar_add_on
                </span>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                  Novo Agendamento
                </h2>

                <p className="mt-1 text-slate-500">
                  Preencha os dados para agendar um atendimento.
                </p>
              </div>
            </header>
            <form
              onSubmit={salvarAgendamento}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6 md:p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="paciente"
                    className="text-sm font-bold text-slate-700"
                  >
                    Paciente <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="paciente"
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">
                      Selecione um paciente
                    </option>

                    {pacientes.map((paciente) => (
                      <option
                        key={paciente.id}
                        value={paciente.id}
                      >
                        {paciente.nome_paciente}{" "}
                        {paciente.sobrenome_paciente}
                      </option>
                    ))}
                  </select>

                  {pacientes.length === 0 && (
                    <p className="text-xs text-slate-400">
                      Nenhum paciente encontrado para sua conta.
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Tipo de atendimento{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTipo("Atendimento")}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                        tipo === "Atendimento"
                          ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl text-emerald-600">
                        medical_services
                      </span>

                      <div className="flex-1">
                        <p className="font-bold text-slate-800">
                          Atendimento
                        </p>
                        <p className="text-xs text-slate-500">
                          Sessão de fisioterapia
                        </p>
                      </div>

                      {tipo === "Atendimento" && (
                        <span className="material-symbols-outlined text-emerald-600">
                          check_circle
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setTipo("Avaliação")}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                        tipo === "Avaliação"
                          ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl text-emerald-600">
                        assignment
                      </span>

                      <div className="flex-1">
                        <p className="font-bold text-slate-800">
                          Avaliação
                        </p>
                        <p className="text-xs text-slate-500">
                          Avaliação inicial
                        </p>
                      </div>

                      {tipo === "Avaliação" && (
                        <span className="material-symbols-outlined text-emerald-600">
                          check_circle
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="data"
                      className="text-sm font-bold text-slate-700"
                    >
                      Data <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="data"
                      type="date"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="hora"
                      className="text-sm font-bold text-slate-700"
                    >
                      Horário <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="hora"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                      ].map((horario) => (
                        <option key={horario} value={horario}>
                          {horario}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="observacao"
                    className="text-sm font-bold text-slate-700"
                  >
                    Observação{" "}
                    <span className="font-normal text-slate-400">
                      (opcional)
                    </span>
                  </label>

                  <textarea
                    id="observacao"
                    value={observacao}
                    onChange={(e) =>
                      setObservacao(e.target.value)
                    }
                    rows={3}
                    placeholder="Ex.: sessão para dor lombar..."
                    className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {erro && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {erro}
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 bg-slate-50/70 p-6 md:px-8">
                <button
                  type="button"
                  onClick={() => navigate("/agenda")}
                  className="rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando || pacientes.length === 0}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-outlined">
                    {salvando ? "progress_activity" : "calendar_check"}
                  </span>

                  {salvando
                    ? "Salvando..."
                    : "Salvar Agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}