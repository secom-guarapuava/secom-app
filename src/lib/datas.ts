// Utilidades de data — seguras quanto a fuso horário.
// IMPORTANTE: "2025-06-13" via new Date() é interpretado como UTC e, no
// horário do Brasil (UTC-3), "volta" para o dia anterior. Por isso aqui
// montamos a data sempre no fuso LOCAL.

const pad = (n: number) => String(n).padStart(2, "0");

export function parseData(iso?: string): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}

export function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// número do "dia" em relação à época, no fuso local (para diferença em dias)
function diaIndex(d: Date): number {
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86_400_000);
}

export function difEmDias(iso?: string): number | null {
  const d = parseData(iso);
  if (!d) return null;
  return diaIndex(d) - diaIndex(new Date());
}

export function ehHoje(iso?: string): boolean {
  return iso === hojeISO();
}

// "Hoje", "Amanhã", "Ontem" ou "Qua, 12 jun"
export function rotuloData(iso?: string): string {
  const dif = difEmDias(iso);
  if (dif === null) return "Sem data definida";
  if (dif === 0) return "Hoje";
  if (dif === 1) return "Amanhã";
  if (dif === -1) return "Ontem";
  const d = parseData(iso)!;
  const txt = d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
  return txt.charAt(0).toUpperCase() + txt.slice(1).replace(/\.$/, "");
}

// texto auxiliar discreto: "em 10 dias" / "há 3 dias"
export function distanciaTexto(iso?: string): string {
  const dif = difEmDias(iso);
  if (dif === null || dif === 0 || dif === 1 || dif === -1) return "";
  return dif > 0 ? `em ${dif} dias` : `há ${Math.abs(dif)} dias`;
}

// chave de ordenação cronológica usando data + hora
export function chaveDataHora(a: { data?: string; horaInicio?: string }): string {
  return `${a.data || "9999-99-99"} ${a.horaInicio || "99:99"}`;
}
