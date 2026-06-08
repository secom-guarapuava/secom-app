"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useDB } from "@/lib/store";
import AgendaCard from "@/components/AgendaCard";
import { tocarAudio } from "@/lib/voz";
import type { Agenda, TipoAgenda } from "@/lib/types";
import { chaveDataHora, distanciaTexto, ehHoje, hojeISO, rotuloData } from "@/lib/datas";

type FiltroTipo = "todas" | TipoAgenda;
type Aba = "proximas" | "finalizadas";

const FILTROS: { chave: FiltroTipo; label: string }[] = [
  { chave: "todas", label: "Todas" },
  { chave: "prefeito", label: "👑 Prefeito" },
  { chave: "prefeitura", label: "Prefeitura" },
];

const FINALIZADO = (a: Agenda) => a.status === "finalizada" || a.status === "cancelada";

interface Grupo { key: string; agendas: Agenda[]; aoVivo: boolean }

export default function Agendas() {
  const db = useDB();
  const [filtro, setFiltro] = useState<FiltroTipo>("todas");
  const [aba, setAba] = useState<Aba>("proximas");
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const semeado = useRef<string>("");

  const qtdFinalizadas = db.agendas.filter(FINALIZADO).length;

  // agrupa por DATA real, respeitando a aba selecionada
  const grupos: Grupo[] = useMemo(() => {
    const base = db.agendas
      .filter((a) => (filtro === "todas" ? true : a.tipo === filtro))
      .filter((a) => (aba === "finalizadas" ? FINALIZADO(a) : !FINALIZADO(a)));

    const mapa = new Map<string, Agenda[]>();
    for (const a of base) {
      const k = a.data || "sem-data";
      const arr = mapa.get(k);
      if (arr) arr.push(a); else mapa.set(k, [a]);
    }

    const lista: Grupo[] = Array.from(mapa.entries()).map(([key, ags]) => ({
      key,
      agendas: ags.sort((a, b) => chaveDataHora(a).localeCompare(chaveDataHora(b))),
      aoVivo: ags.some((a) => a.status === "em_andamento"),
    }));

    // próximas: data crescente (sem-data por último). finalizadas: mais recente primeiro
    lista.sort((a, b) => {
      const ka = a.key === "sem-data" ? "9999-99-99" : a.key;
      const kb = b.key === "sem-data" ? "9999-99-99" : b.key;
      return aba === "finalizadas" ? kb.localeCompare(ka) : ka.localeCompare(kb);
    });
    return lista;
  }, [db.agendas, filtro, aba]);

  // abre por padrão o dia de HOJE (ou o primeiro grupo) ao entrar/trocar de aba
  useEffect(() => {
    if (semeado.current === aba || grupos.length === 0) return;
    semeado.current = aba;
    const hojeKey = hojeISO();
    const inicial =
      aba === "proximas"
        ? grupos.find((g) => g.key === hojeKey)?.key ?? grupos[0]?.key
        : grupos[0]?.key;
    setAbertos(inicial ? new Set([inicial]) : new Set());
  }, [aba, grupos]);

  function trocarAba(nova: Aba) {
    if (nova === aba) return;
    semeado.current = "";
    setAba(nova);
  }

  function alternar(key: string) {
    setAbertos((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[22px] font-bold text-ink">Agendas</h1>
        <button onClick={() => tocarAudio()}
          className="flex items-center gap-1.5 text-[11.5px] font-medium text-brand-600 bg-brand-50 rounded-full px-3 py-1.5 active:scale-95 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" /></svg>
          Ouvir
        </button>
      </div>

      {/* Abas: Próximas x Finalizadas */}
      <div className="grid grid-cols-2 gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-3 shadow-card">
        {([["proximas", "Próximas"], ["finalizadas", "Finalizadas"]] as [Aba, string][]).map(([k, label]) => (
          <button key={k} onClick={() => trocarAba(k)}
            className={`py-2 rounded-lg text-[12.5px] font-semibold transition flex items-center justify-center gap-1.5 ${aba === k ? "bg-navy text-white shadow-card" : "text-muted"}`}>
            {label}
            {k === "finalizadas" && qtdFinalizadas > 0 && (
              <span className={`text-[10px] rounded-full px-1.5 ${aba === k ? "bg-white/20" : "bg-slate-100 text-muted"}`}>{qtdFinalizadas}</span>
            )}
          </button>
        ))}
      </div>

      {/* Filtro por tipo */}
      <div className="flex gap-2 mb-1 overflow-x-auto no-scrollbar">
        {FILTROS.map((f) => (
          <button key={f.chave} onClick={() => setFiltro(f.chave)}
            className={`whitespace-nowrap text-[12.5px] font-medium px-3.5 py-1.5 rounded-full border transition active:scale-95 ${filtro === f.chave ? "bg-navy text-white border-navy shadow-card" : "border-slate-200 text-muted bg-white"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {grupos.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-muted text-sm mt-4 shadow-card">
          {aba === "finalizadas"
            ? "Nenhuma agenda finalizada ainda."
            : <>Nenhuma agenda por aqui.<br />Toque no botão <span className="text-brand font-semibold">+</span> para adicionar.</>}
        </div>
      ) : (
        <LayoutGroup>
          <div className="mt-3 space-y-2.5">
            {grupos.map((g) => {
              const aberto = abertos.has(g.key);
              const hoje = ehHoje(g.key);
              const dist = distanciaTexto(g.key);
              return (
                <motion.div layout key={g.key}
                  className={`bg-white border rounded-2xl overflow-hidden shadow-card ${hoje ? "border-brand/40" : "border-slate-200/80"}`}>
                  {/* Cabeçalho clicável do dia */}
                  <button onClick={() => alternar(g.key)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                    <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${hoje ? "bg-brand-grad text-white" : "bg-navy/5 text-navy"}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4M16 2v4M3 9h18M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /></svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[14px] font-bold ${hoje ? "text-brand-600" : "text-ink"}`}>{rotuloData(g.key)}</span>
                        {g.aoVivo && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulseLive" />}
                      </div>
                      {dist && <div className="text-[11px] text-muted">{dist}</div>}
                    </div>
                    <span className="text-[11px] font-semibold text-muted bg-soft rounded-full px-2 py-0.5 min-w-[22px] text-center">{g.agendas.length}</span>
                    <motion.svg animate={{ rotate: aberto ? 90 : 0 }} transition={{ duration: 0.2 }}
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
                      <path d="M9 6l6 6-6 6" />
                    </motion.svg>
                  </button>

                  {/* Corpo expansível */}
                  <AnimatePresence initial={false}>
                    {aberto && (
                      <motion.div key="corpo" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="px-3 pb-3 pt-0.5 border-t border-slate-100">
                          <div className="mt-3">
                            {g.agendas.map((a, i) => <AgendaCard key={a.id} agenda={a} equipe={db.equipe} index={i} />)}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>
      )}
    </div>
  );
}
