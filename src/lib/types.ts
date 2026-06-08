// Tipos do dominio — Central SECOM

export type StatusAgenda =
  | "agendada"
  | "em_deslocamento"
  | "em_andamento"
  | "finalizada"
  | "cancelada";

export type TipoAgenda = "prefeitura" | "prefeito";
export type Setor = "REDES" | "JOR";

export interface Membro {
  id: string;
  nome: string;
  setor: Setor;
  telefone?: string;
}

export interface Agenda {
  id: string;
  titulo: string;
  tipo: TipoAgenda;
  descricao?: string;
  data: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaFim?: string;
  tipoCobertura?: string; // ex.: Foto, Video, Texto, Transmissao
  local: string;
  endereco: string;
  lat?: number;
  lng?: number;
  responsaveis: string[]; // ids de Membro
  status: StatusAgenda;
  observacoes?: string;
  criadaEmISO: string;
}

export interface PlantaoDia {
  dia: number;        // 1..31
  mes?: number;       // 1..12 (opcional)
  nomes: string[];
}
