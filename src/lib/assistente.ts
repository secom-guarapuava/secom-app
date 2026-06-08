// Assistente interno LOCAL (sem custo). Filtra os dados em tempo real por
// Local, Hora, Tipo (Prefeito/Prefeitura) ou Assunto, e responde sobre o plantao.

import type { Agenda, Membro } from "./types";
import { STATUS } from "./status";
import { parsePlantao, plantaoDeHoje } from "./plantao";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function horario(a: Agenda) {
  return `${a.horaInicio}${a.horaFim ? "\u2013" + a.horaFim : ""}`;
}

export interface RespostaAssistente {
  texto: string;
  agendas?: Agenda[];
}

export function responder(
  perguntaRaw: string,
  agendas: Agenda[],
  equipe: Membro[],
  plantaoTexto: string
): RespostaAssistente {
  const p = norm(perguntaRaw);
  const nome = (idm: string) => equipe.find((u) => u.id === idm)?.nome || "\u2014";
  const ordenadas = [...agendas].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  const listar = (arr: Agenda[]) =>
    arr.map((a) => `\u2022 ${horario(a)} \u2014 ${a.titulo} (${a.local}) [${a.responsaveis.map(nome).join(", ") || "sem equipe"}]`).join("\n");

  // ----- PLANTAO -----
  if (p.includes("plantao") || p.includes("escala") || p.includes("plantonista")) {
    const dias = parsePlantao(plantaoTexto);
    const hoje = plantaoDeHoje(dias);
    if (hoje) return { texto: `Hoje (dia ${hoje.dia}) esta de plantao: ${hoje.nomes.join(", ")}.` };
    if (dias.length) return { texto: "Nao encontrei plantao para hoje na escala cadastrada." };
    return { texto: "Ainda nao ha escala de plantao cadastrada. Va em Plantao e cole o texto do mes." };
  }

  // ----- PREFEITO / PREFEITURA (tipo) -----
  if (p.includes("prefeito") && !p.includes("prefeitura")) {
    const ag = ordenadas.filter((a) => a.tipo === "prefeito");
    const ativa = ag.find((a) => a.status === "em_andamento" || a.status === "em_deslocamento");
    if (ativa) return { texto: `Agenda do Prefeito em ${STATUS[ativa.status].label.toLowerCase()}: "${ativa.titulo}" (${horario(ativa)}) em ${ativa.local}.`, agendas: [ativa] };
    if (ag.length) return { texto: `Agendas do Prefeito hoje:\n${listar(ag)}`, agendas: ag };
    return { texto: "Nao ha agendas do Prefeito hoje." };
  }
  if (p.includes("prefeitura")) {
    const ag = ordenadas.filter((a) => a.tipo === "prefeitura");
    return ag.length
      ? { texto: `Agendas da Prefeitura:\n${listar(ag)}`, agendas: ag }
      : { texto: "Nao ha agendas da Prefeitura hoje." };
  }

  // ----- AGORA / AO VIVO -----
  if (p.includes("agora") || p.includes("ao vivo") || p.includes("andamento") || p.includes("acontecendo")) {
    const ag = ordenadas.filter((a) => a.status === "em_andamento");
    return ag.length
      ? { texto: `Acontecendo agora:\n${listar(ag)}`, agendas: ag }
      : { texto: "Nenhuma cobertura ao vivo neste momento." };
  }

  // ----- PROXIMA -----
  if (p.includes("proxima") || p.includes("proximo")) {
    const prox = ordenadas.find((a) => a.status === "agendada" || a.status === "em_deslocamento");
    return prox
      ? { texto: `Proxima agenda: "${prox.titulo}" as ${prox.horaInicio} em ${prox.local}. Equipe: ${prox.responsaveis.map(nome).join(", ") || "\u2014"}.`, agendas: [prox] }
      : { texto: "Nao ha mais agendas pendentes hoje." };
  }

  // ----- POR HORA (ex.: "14h", "as 9 horas") -----
  const mh = p.match(/(\d{1,2})\s*(?:h|hora|:)/);
  if (mh) {
    const hh = mh[1].padStart(2, "0");
    const ag = ordenadas.filter((a) => a.horaInicio.startsWith(hh));
    if (ag.length) return { texto: `Agendas por volta das ${hh}h:\n${listar(ag)}`, agendas: ag };
  }

  // ----- POR ASSUNTO / LOCAL (busca livre) -----
  const stop = ["qual","quais","onde","quem","tem","agenda","agendas","hoje","esta","estao","sobre","local","assunto","cobrindo","cobertura","existe","mostrar","mostre","liste"];
  const termos = p.replace(/[?!.]/g, "").split(/\s+/).filter((t) => t.length > 3 && !stop.includes(t));
  if (termos.length) {
    const ag = ordenadas.filter((a) =>
      termos.some((t) => norm(`${a.titulo} ${a.local} ${a.endereco} ${a.descricao || ""} ${a.tipoCobertura || ""}`).includes(t))
    );
    if (ag.length) return { texto: `Encontrei ${ag.length} agenda(s):\n${listar(ag)}`, agendas: ag };
  }

  // ----- RESUMO -----
  if (p.includes("resumo") || p.includes("dia") || p.includes("tudo")) {
    return { texto: `Hoje ha ${agendas.length} agenda(s):\n${listar(ordenadas)}`, agendas: ordenadas };
  }

  return {
    texto:
      'Posso filtrar por assunto, local, hora ou tipo. Tente: "agendas do Prefeito", "o que tem na Escola Municipal?", "agenda das 14h", "quem esta de plantao hoje?".',
  };
}

export const SUGESTOES = [
  "Agendas do Prefeito",
  "O que tem na Escola Municipal?",
  "Agenda das 14h",
  "Quem est\u00e1 de plant\u00e3o hoje?",
];
