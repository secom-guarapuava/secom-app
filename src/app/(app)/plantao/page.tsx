"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDB, salvarPlantao } from "@/lib/store";
import { parsePlantao, plantaoDeHoje, acharMembro } from "@/lib/plantao";
import { PLANTAO_EXEMPLO } from "@/lib/seed";

export default function Plantao() {
  const db = useDB();
  const [editando, setEditando] = useState(!db.plantaoTexto);
  const [texto, setTexto] = useState(db.plantaoTexto);

  const dias = parsePlantao(db.plantaoTexto);
  const hoje = plantaoDeHoje(dias);
  const diaHoje = new Date().getDate();

  function salvar() {
    salvarPlantao(texto);
    setEditando(false);
  }

  function BotaoLigar({ nome }: { nome: string }) {
    const m = acharMembro(nome, db.equipe);
    if (!m?.telefone) return <span className="text-[12px] text-ink">{nome}</span>;
    return (
      <a href={`tel:${m.telefone.replace(/\D/g, "")}`} className="text-[12px] text-navy underline decoration-dotted">
        {nome} 📞
      </a>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[22px] font-bold text-ink">Escala de Plantão</h1>
        <button onClick={() => setEditando((v) => !v)} className="text-[12px] font-semibold text-brand-600 bg-brand-50 rounded-full px-3 py-1.5">
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>

      {hoje && !editando && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-navy-grad text-white rounded-2xl p-4 mb-4 shadow-navy glow-top overflow-hidden">
          <div className="relative text-[10px] text-slate-300 font-semibold tracking-wide">PLANTÃO DE HOJE · DIA {hoje.dia}</div>
          <div className="relative font-medium mt-2 flex flex-wrap gap-2">
            {hoje.nomes.map((n) => {
              const m = acharMembro(n, db.equipe);
              return m?.telefone ? (
                <a key={n} href={`tel:${m.telefone.replace(/\D/g, "")}`} className="bg-brand-grad rounded-full px-3 py-1 text-[12px] font-medium">📞 {n}</a>
              ) : <span key={n} className="bg-white/10 rounded-full px-3 py-1 text-[12px]">{n}</span>;
            })}
          </div>
        </motion.div>
      )}

      {editando ? (
        <div>
          <p className="text-[12px] text-muted mb-2">
            Cole abaixo a escala do mês inteiro (em texto corrido). O app organiza por dia automaticamente.
          </p>
          <textarea
            value={texto} onChange={(e) => setTexto(e.target.value)}
            placeholder={PLANTAO_EXEMPLO}
            rows={12}
            className="w-full px-3 py-3 rounded-xl border border-slate-200 text-[13px] outline-none focus:border-brand font-mono leading-relaxed"
          />
          <button onClick={salvar} className="w-full btn-brand rounded-xl py-3.5 mt-3 font-semibold transition">
            Organizar e salvar
          </button>
        </div>
      ) : dias.length === 0 ? (
        <p className="text-muted text-sm text-center py-10">Nenhuma escala cadastrada ainda.<br />Toque em “Editar” para colar a escala do mês.</p>
      ) : (
        <div className="space-y-2">
          {dias.map((d, i) => {
            const ehHoje = d.dia === diaHoje;
            return (
              <motion.div key={`${d.dia}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                className={`flex items-center gap-3 rounded-2xl p-3 border shadow-card ${ehHoje ? "bg-brand-50 border-brand/40" : "bg-white border-slate-200/80"}`}>
                <div className={`w-11 h-11 rounded-xl grid place-items-center font-bold text-sm shrink-0 ${ehHoje ? "bg-brand-grad text-white" : "bg-soft text-navy"}`}>
                  {String(d.dia).padStart(2, "0")}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {d.nomes.map((n, j) => <BotaoLigar key={j} nome={n} />)}
                </div>
                {ehHoje && <span className="ml-auto text-[10px] text-brand font-medium">HOJE</span>}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
