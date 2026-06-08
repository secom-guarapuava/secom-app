"use client";

import { motion } from "framer-motion";
import StatusPill from "./StatusPill";
import { STATUS, proximoStatus, rotuloAvancar } from "@/lib/status";
import { abrirRota } from "@/lib/maps";
import { mudarStatus } from "@/lib/store";
import { useUI } from "./UIProvider";
import type { Agenda, Membro } from "@/lib/types";

function Ico({ d }: { d: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 -mt-px inline">
      <path d={d} />
    </svg>
  );
}

export default function AgendaCard({ agenda, equipe, index = 0 }: { agenda: Agenda; equipe: Membro[]; index?: number }) {
  const { verDetalhe } = useUI();
  const nomes = agenda.responsaveis.map((id) => equipe.find((m) => m.id === id)?.nome).filter(Boolean) as string[];
  const avancar = rotuloAvancar(agenda.status);
  const prox = proximoStatus(agenda.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, layout: { duration: 0.3 } }}
      className={`bg-white border border-slate-200/80 border-l-[4px] ${STATUS[agenda.status].bar} rounded-r-2xl rounded-l-md p-4 mb-3 shadow-card`}
    >
      <button onClick={() => verDetalhe(agenda)} className="block w-full text-left">
        <div className="flex items-center justify-between gap-2">
          <StatusPill status={agenda.status} />
          {agenda.tipo === "prefeito" && (
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">👑 PREFEITO</span>
          )}
        </div>
        <div className="font-semibold text-ink mt-2 text-[14px] leading-snug">{agenda.titulo}</div>
        <div className="text-[11.5px] text-muted mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1"><Ico d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" /> {agenda.horaInicio}{agenda.horaFim ? `–${agenda.horaFim}` : ""}</span>
          <span className="inline-flex items-center gap-1"><Ico d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11zM12 10m-2.5 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0" /> {agenda.local}</span>
        </div>
        {nomes.length > 0 && (
          <div className="text-[11.5px] text-muted mt-1 inline-flex items-center gap-1">
            <Ico d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" /> {nomes.join(", ")}
          </div>
        )}
      </button>

      {avancar && prox && (
        <button onClick={() => mudarStatus(agenda.id, prox)}
          className="w-full btn-brand rounded-xl py-2.5 mt-3 text-[12.5px] font-semibold flex items-center justify-center gap-1.5 transition">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d={STATUS[prox].icon} /></svg>
          {avancar}
        </button>
      )}

      <div className="flex gap-2 mt-2">
        <button onClick={() => abrirRota(agenda.lat, agenda.lng, agenda.endereco)}
          className="flex-1 text-[11.5px] text-brand-600 font-medium border border-brand/30 rounded-xl py-2 active:scale-[0.98] transition inline-flex items-center justify-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 20l-5.5 2.5V6L9 3.5m0 16.5l6-2.5m-6 2.5V3.5m6 14l5.5 2.5V6L15 3.5m0 14V3.5m-6 0l6 2.5" /></svg>
          Rota
        </button>
        <button onClick={() => verDetalhe(agenda)}
          className="flex-1 text-[11.5px] text-navy font-medium border border-slate-200 rounded-xl py-2 active:scale-[0.98] transition">
          Detalhes
        </button>
      </div>
    </motion.div>
  );
}
