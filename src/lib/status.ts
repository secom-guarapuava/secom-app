import type { StatusAgenda } from "./types";

interface StatusInfo {
  label: string;
  curto: string;        // rótulo curto para botões/seções
  pill: string;         // cores do "pill" (badge)
  bar: string;          // borda lateral do card
  dot: string;          // cor do ponto
  solid: string;        // botão ativo (fundo sólido)
  icon: string;         // path do ícone (svg)
}

export const STATUS: Record<StatusAgenda, StatusInfo> = {
  agendada: {
    label: "Agendada", curto: "Agendada",
    pill: "bg-blue-50 text-blue-700", bar: "border-blue-500", dot: "bg-blue-500",
    solid: "bg-blue-600 text-white border-blue-600",
    icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  },
  em_deslocamento: {
    label: "Em deslocamento", curto: "A caminho",
    pill: "bg-brand-50 text-brand-600", bar: "border-brand", dot: "bg-brand",
    solid: "bg-brand text-white border-brand",
    icon: "M3 11l19-9-9 19-2-8-8-2z",
  },
  em_andamento: {
    label: "Em andamento", curto: "Ao vivo",
    pill: "bg-emerald-50 text-emerald-700", bar: "border-emerald-500", dot: "bg-emerald-500",
    solid: "bg-emerald-600 text-white border-emerald-600",
    icon: "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4",
  },
  finalizada: {
    label: "Finalizada", curto: "Finalizada",
    pill: "bg-slate-100 text-slate-600", bar: "border-slate-400", dot: "bg-slate-400",
    solid: "bg-slate-700 text-white border-slate-700",
    icon: "M20 6 9 17l-5-5",
  },
  cancelada: {
    label: "Cancelada", curto: "Cancelada",
    pill: "bg-red-50 text-red-700", bar: "border-red-400", dot: "bg-red-500",
    solid: "bg-red-600 text-white border-red-600",
    icon: "M15 9l-6 6M9 9l6 6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  },
};

export const ORDEM_STATUS: StatusAgenda[] = ["agendada", "em_deslocamento", "em_andamento", "finalizada", "cancelada"];

// Fluxo natural: qual é o próximo passo a partir do status atual (para a ação rápida no card)
const FLUXO: Partial<Record<StatusAgenda, StatusAgenda>> = {
  agendada: "em_deslocamento",
  em_deslocamento: "em_andamento",
  em_andamento: "finalizada",
};

export function proximoStatus(s: StatusAgenda): StatusAgenda | null {
  return FLUXO[s] ?? null;
}

// Texto da ação rápida ("avançar") conforme o próximo status
export function rotuloAvancar(s: StatusAgenda): string | null {
  const p = proximoStatus(s);
  if (!p) return null;
  if (p === "em_deslocamento") return "Iniciar deslocamento";
  if (p === "em_andamento") return "Iniciar cobertura";
  if (p === "finalizada") return "Finalizar";
  return STATUS[p].label;
}

// Agrupamento usado na tela de Agendas
export const GRUPOS: { chave: StatusAgenda; titulo: string }[] = [
  { chave: "em_andamento", titulo: "Ao vivo agora" },
  { chave: "em_deslocamento", titulo: "A caminho" },
  { chave: "agendada", titulo: "Agendadas" },
  { chave: "finalizada", titulo: "Finalizadas" },
  { chave: "cancelada", titulo: "Canceladas" },
];
