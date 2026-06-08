import type { Agenda, Membro } from "./types";

// Data de hoje (YYYY-MM-DD) para os exemplos aparecerem sempre "hoje"
function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const HOJE = hojeISO();

// === EQUIPE REAL ===
export const SEED_EQUIPE: Membro[] = [
  { id: "m1", nome: "Eduarda", setor: "REDES", telefone: "" },
  { id: "m2", nome: "Allan", setor: "REDES", telefone: "" },
  { id: "m3", nome: "João", setor: "REDES", telefone: "" },
  { id: "m4", nome: "João (Estagiário)", setor: "REDES", telefone: "" },
  { id: "m5", nome: "Bárbara", setor: "JOR", telefone: "" },
  { id: "m6", nome: "Noeli", setor: "JOR", telefone: "" },
  { id: "m7", nome: "Laura", setor: "JOR", telefone: "" },
  { id: "m8", nome: "Victor", setor: "JOR", telefone: "" },
];

// === AGENDAS FICTICIAS (para apresentacao — pode editar/excluir) ===
export const SEED_AGENDAS: Agenda[] = [
  {
    id: "a1",
    titulo: "Inauguração da UBS — Bairro Industrial",
    tipo: "prefeitura",
    descricao: "Cobertura completa da inauguração da nova Unidade Básica de Saúde.",
    data: HOJE, horaInicio: "09:00", horaFim: "10:30",
    tipoCobertura: "Foto + Vídeo",
    local: "UBS Bairro Industrial", endereco: "Av. Industrial, 1200 — Guarapuava, PR",
    lat: -25.395, lng: -51.452,
    responsaveis: ["m3", "m7"], status: "em_andamento",
    observacoes: "Levar tripé e microfone de lapela.", criadaEmISO: new Date().toISOString(),
  },
  {
    id: "a2",
    titulo: "Coletiva de imprensa — Prefeito",
    tipo: "prefeito",
    descricao: "Anúncio do pacote de obras de pavimentação.",
    data: HOJE, horaInicio: "14:30", horaFim: "15:30",
    tipoCobertura: "Transmissão ao vivo",
    local: "Paço Municipal", endereco: "Rua Brigadeiro Rocha, 2777 — Centro, Guarapuava, PR",
    lat: -25.3935, lng: -51.457,
    responsaveis: ["m1", "m5"], status: "em_deslocamento",
    criadaEmISO: new Date().toISOString(),
  },
  {
    id: "a3",
    titulo: "Entrega de obras — Praça Central",
    tipo: "prefeitura",
    descricao: "Registro fotográfico e nota para o site.",
    data: HOJE, horaInicio: "16:00",
    tipoCobertura: "Foto",
    local: "Praça Central", endereco: "Praça Cel. Saturnino — Centro, Guarapuava, PR",
    lat: -25.3905, lng: -51.4585,
    responsaveis: ["m7"], status: "agendada",
    criadaEmISO: new Date().toISOString(),
  },
  {
    id: "a4",
    titulo: "Visita oficial — Escola Municipal",
    tipo: "prefeito",
    descricao: "Agenda do Prefeito com cobertura de imagem.",
    data: HOJE, horaInicio: "11:00",
    tipoCobertura: "Vídeo",
    local: "Escola Municipal Pingo de Gente", endereco: "Bairro dos Estados — Guarapuava, PR",
    lat: -25.401, lng: -51.449,
    responsaveis: ["m2", "m8"], status: "agendada",
    criadaEmISO: new Date().toISOString(),
  },
  {
    id: "a5",
    titulo: "Reunião de pauta — Redação",
    tipo: "prefeitura",
    descricao: "Briefing da semana com a equipe.",
    data: HOJE, horaInicio: "08:00", horaFim: "08:45",
    tipoCobertura: "Interno",
    local: "Secretaria de Comunicação", endereco: "Rua XV de Novembro, 100 — Centro, Guarapuava, PR",
    lat: -25.3902, lng: -51.456,
    responsaveis: ["m6"], status: "finalizada",
    criadaEmISO: new Date().toISOString(),
  },
];

export const PLANTAO_EXEMPLO = `Exemplo (cole o texto do mês inteiro aqui):
01 - Eduarda e Allan
02 - João
03 - Bárbara, Victor
04 - Laura
05 - Noeli e João Estagiário`;
