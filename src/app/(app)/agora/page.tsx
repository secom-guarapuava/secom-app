"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDB, mudarStatus } from "@/lib/store";
import { useUI } from "@/components/UIProvider";
import { abrirRota } from "@/lib/maps";

function relogio() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Agora() {
  const db = useDB();
  const { verDetalhe } = useUI();
  const [hora, setHora] = useState("");

  useEffect(() => {
    setHora(relogio());
    const t = setInterval(() => setHora(relogio()), 1000);
    return () => clearInterval(t);
  }, []);

  const aoVivo = db.agendas.filter((a) => a.status === "em_andamento").sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  const prefeito = db.agendas.filter((a) => a.tipo === "prefeito" && a.status !== "finalizada" && a.status !== "cancelada");
  const nomes = (ids: string[]) => ids.map((id) => db.equipe.find((m) => m.id === id)?.nome).filter(Boolean) as string[];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulseLive" />
        <h1 className="text-[22px] font-bold text-ink">Agora</h1>
        <span className="text-[12px] font-medium text-muted ml-auto tabular-nums bg-white border border-slate-200 rounded-full px-2.5 py-1">{hora}</span>
      </div>

      {aoVivo.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-muted text-sm shadow-card">
          Nenhuma cobertura ao vivo neste momento.
        </div>
      )}

      {aoVivo.map((a) => (
        <motion.div key={a.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-navy-grad text-white rounded-2xl p-4 mb-3 shadow-navy glow-top overflow-hidden">
          <button onClick={() => verDetalhe(a)} className="relative block w-full text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-500 text-white px-2.5 py-1 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulseLive" /> AO VIVO
              </span>
              <span className="text-[11px] text-slate-300 ml-auto">🕐 {a.horaInicio}{a.horaFim ? `–${a.horaFim}` : ""}</span>
            </div>
            <div className="font-semibold mt-2.5 text-[15px]">{a.titulo}</div>
            <div className="text-[12px] text-slate-200 mt-1.5">📍 {a.local}</div>
            <div className="text-[12px] text-slate-200 mt-1">👥 {nomes(a.responsaveis).join(", ") || "Sem equipe alocada"}</div>
          </button>
          <div className="relative flex gap-2 mt-3">
            <button onClick={() => abrirRota(a.lat, a.lng, a.endereco)}
              className="flex-1 bg-white/15 hover:bg-white/20 text-white rounded-xl py-2 text-[12px] font-medium active:scale-[0.98] transition">
              🗺️ Rota
            </button>
            <button onClick={() => mudarStatus(a.id, "finalizada")}
              className="flex-1 bg-white text-navy rounded-xl py-2 text-[12px] font-semibold active:scale-[0.98] transition inline-flex items-center justify-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              Finalizar
            </button>
          </div>
        </motion.div>
      ))}

      {prefeito.length > 0 && (
        <>
          <p className="text-[12px] text-muted font-medium mt-5 mb-2">👑 Agenda do Prefeito</p>
          {prefeito.map((a) => (
            <div key={a.id} className="bg-white border-2 border-brand/70 rounded-2xl p-4 mb-3 shadow-card">
              <button onClick={() => verDetalhe(a)} className="block w-full text-left">
                <div className="text-brand-600 text-[11px] font-bold tracking-wide">AGENDA DO PREFEITO</div>
                <div className="font-semibold text-ink mt-1 text-[15px]">{a.titulo}</div>
                <div className="text-[12px] text-muted mt-1.5">🕐 {a.horaInicio} · {a.local}</div>
                <div className="text-[12px] text-muted mt-1">👥 {nomes(a.responsaveis).join(", ") || "—"}</div>
              </button>
              <button onClick={() => abrirRota(a.lat, a.lng, a.endereco)}
                className="w-full btn-brand rounded-xl py-2.5 mt-3 text-[12px] font-semibold active:scale-[0.98] transition">
                🗺️ Abrir rota no Maps
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
