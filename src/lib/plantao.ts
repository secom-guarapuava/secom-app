import type { PlantaoDia, Membro } from "./types";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

// Recebe texto corrido do plantao do mes e devolve uma lista por dia.
// Aceita formatos como:
//   "01 - Eduarda e Allan"
//   "Dia 2: João"
//   "03/06 Bárbara, Victor"
//   "5 — Noeli e João Estagiário"
export function parsePlantao(texto: string): PlantaoDia[] {
  const linhas = texto.split(/\r?\n/);
  const dias: PlantaoDia[] = [];

  for (const linhaRaw of linhas) {
    const linha = linhaRaw.trim();
    if (!linha) continue;

    // captura dia (1-31), opcional /mes, e o resto (nomes)
    const m = linha.match(/^\s*(?:dia\s*)?(\d{1,2})(?:\/(\d{1,2}))?\s*[-—:.)]*\s*(.+)$/i);
    if (!m) continue;

    const dia = parseInt(m[1], 10);
    if (dia < 1 || dia > 31) continue;
    const mes = m[2] ? parseInt(m[2], 10) : undefined;

    const nomes = m[3]
      .split(/,| e | & |\/|\+/i)
      .map((n) => n.trim())
      .filter((n) => n.length > 1);

    if (nomes.length) dias.push({ dia, mes, nomes });
  }

  return dias.sort((a, b) => a.dia - b.dia);
}

// Plantao de hoje, considerando o dia do mes (e mes se informado)
export function plantaoDeHoje(dias: PlantaoDia[]): PlantaoDia | undefined {
  const hoje = new Date();
  const d = hoje.getDate();
  const mes = hoje.getMonth() + 1;
  return dias.find((p) => p.dia === d && (p.mes === undefined || p.mes === mes));
}

// Tenta casar um nome do plantao com um membro cadastrado (para habilitar ligar)
export function acharMembro(nome: string, equipe: Membro[]): Membro | undefined {
  const n = norm(nome);
  return (
    equipe.find((m) => norm(m.nome) === n) ||
    equipe.find((m) => norm(m.nome).startsWith(n) || n.startsWith(norm(m.nome)))
  );
}
