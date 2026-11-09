export const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"
).replace(/\/+$/, "")

export async function api<T = any>(
  caminho: string,
  opcoes: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token")

  const resp = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  })

  const corpo = await resp.json().catch(() => null)
  if (resp.status === 401) {
  localStorage.removeItem("token");
  window.location.href = "/"; // ajuste para a rota da sua tela de login
}
  if (!resp.ok) throw new Error(corpo?.error ?? "Erro na requisição")
  return corpo as T
}

// Data/hora local sem fuso, no mesmo formato gravado em agendamentos.data_hora
export function agoraLocal() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}