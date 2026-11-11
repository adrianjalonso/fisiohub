export function primeiroNome(nome?: string | null): string {
  const limpo = nome?.trim() ?? "";
  if (!limpo) return "";
  return limpo.split(/\s+/)[0];
}
