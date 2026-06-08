"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "./UIProvider";
import { useDB, mudarStatus, excluirAgenda } from "@/lib/store";
import { abrirRota } from "@/lib/maps";
import StatusPill from "./StatusPill";
import { STATUS } from "@/lib/status";
import type { StatusAgenda } from "@/lib/types";

const ETAPAS: StatusAgenda[] = ["agendada", "em_deslocamento", "em_andamento", "finalizada"];

export default function AgendaDrawer() {
  const { detalhe, fecharDetalhe, editar } = useUI();
  const db = useDB();
  // pega versao mais recente do store
  const a = detalhe ? db.agendas.find((x) => x.id === detalhe.id) || detalhe : null;

  return (
    <AnimatePresence>
      {a && (
        <motion.div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-end justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={fecharDetalhe}>
          <motion.div
            className="bg-white w-full max-w-md rounded-t-3xl max-h-[90dvh] overflow-y-auto no-scrollbar shadow-navy"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-5 pt-5 pb-3">
              <div className="w-10 h-1.5 bg-slate-200 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="flex items-center justify-between mt-1">
                <StatusPill status={a.status} />
                {a.tipo === "prefeito" && <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">👑 PREFEITO</span>}
              </div>
              <h2 className="text-xl font-semibold text-ink mt-2.5 leading-tight">{a.titulo}</h2>
              {a.descricao && <p className="text-[13px] text-muted mt-1.5 leading-relaxed">{a.descricao}</p>}
            </div>

            <div className="px-5 space-y-2.5 text-[13px]">
              <Linha r="Horário" v={`${a.horaInicio}${a.horaFim ? "–" + a.horaFim : ""}`} />
              <Linha r="Data" v={a.data} />
              <Linha r="Cobertura" v={a.tipoCobertura || "—"} />
              <Linha r="Local" v={a.local} />
              <Linha r="Endereço" v={a.endereco} />
              <Linha r="Responsáveis" v={a.responsaveis.map((id) => db.equipe.find((m) => m.id === id)?.nome).filter(Boolean).join(", ") || "—"} />
              {a.observacoes && <Linha r="Observações" v={a.observacoes} />}
            </div>

            <div className="px-5 mt-5">
              <button onClick={() => abrirRota(a.lat, a.lng, a.endereco)}
                className="w-full btn-brand rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 20l-5.5 2.5V6L9 3.5m0 16.5l6-2.5m-6 2.5V3.5m6 14l5.5 2.5V6L15 3.5m0 14V3.5m-6 0l6 2.5" /></svg>
                Abrir rota no Google Maps
              </button>
            </div>

            <div className="px-5 mt-5">
              <p className="text-[11px] text-muted font-medium mb-2 uppercase tracking-wide">Atualizar status</p>
              <div className="grid grid-cols-2 gap-2">
                {ETAPAS.map((s) => {
                  const ativo = a.status === s;
                  return (
                    <button key={s} onClick={() => mudarStatus(a.id, s)}
                      className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-[12px] font-semibold border transition active:scale-[0.97]
                        ${ativo ? STATUS[s].solid + " shadow-card" : "bg-white border-slate-200 text-muted"}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={STATUS[s].icon} /></svg>
                      {STATUS[s].label}
                    </button>
                  );
                })}
              </div>

              {a.status === "cancelada" ? (
                <button onClick={() => mudarStatus(a.id, "agendada")}
                  className="w-full mt-2 py-2.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-navy active:scale-[0.98] transition">
                  ↺ Reabrir agenda
                </button>
              ) : (
                <button onClick={() => mudarStatus(a.id, "cancelada")}
                  className="w-full mt-2 py-2.5 rounded-xl text-[12px] font-semibold border border-red-200 text-red-600 active:scale-[0.98] transition">
                  Cancelar agenda
                </button>
              )}
            </div>

            <div className="px-5 mt-5 mb-8 flex gap-2">
              <button onClick={() => editar(a)} className="flex-1 bg-navy text-white rounded-xl py-3 text-[13px] font-medium active:scale-[0.98] transition">Editar</button>
              <button onClick={() => { if (confirm("Excluir esta agenda?")) { excluirAgenda(a.id); fecharDetalhe(); } }}
                className="flex-1 border border-red-200 text-red-600 rounded-xl py-3 text-[13px] font-medium active:scale-[0.98] transition">Excluir</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Linha({ r, v }: { r: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-muted min-w-[96px]">{r}</span>
      <span className="text-ink flex-1">{v}</span>
    </div>
  );
}
