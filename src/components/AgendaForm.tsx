"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "./UIProvider";
import { useDB, salvarAgenda } from "@/lib/store";
import type { Agenda, TipoAgenda } from "@/lib/types";

const COBERTURAS = ["Foto", "Vídeo", "Foto + Vídeo", "Texto", "Transmissão ao vivo", "Interno"];

function vazia(): Partial<Agenda> {
  const d = new Date();
  return {
    titulo: "", tipo: "prefeitura", data: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    horaInicio: "", horaFim: "", tipoCobertura: "Foto", local: "", endereco: "", responsaveis: [], observacoes: "",
  };
}

export default function AgendaForm() {
  const { formAberto, agendaEmEdicao, fecharForm } = useUI();
  const db = useDB();
  const [f, setF] = useState<Partial<Agenda>>(vazia());
  const [geo, setGeo] = useState("");

  useEffect(() => {
    if (formAberto) { setF(agendaEmEdicao ? { ...agendaEmEdicao } : vazia()); setGeo(""); }
  }, [formAberto, agendaEmEdicao]);

  const set = (k: keyof Agenda, v: any) => setF((p) => ({ ...p, [k]: v }));

  function toggleResp(id: string) {
    const atual = f.responsaveis || [];
    set("responsaveis", atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]);
  }

  function usarLocalizacao() {
    if (!navigator.geolocation) { setGeo("Geolocalização não suportada"); return; }
    setGeo("Obtendo localização…");
    navigator.geolocation.getCurrentPosition(
      (pos) => { set("lat", pos.coords.latitude); set("lng", pos.coords.longitude); setGeo(`📍 ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`); },
      () => setGeo("Não foi possível obter a localização")
    );
  }

  function salvar() {
    if (!f.titulo?.trim() || !f.horaInicio) { alert("Preencha ao menos Assunto e Horário de início."); return; }
    salvarAgenda(f);
    fecharForm();
  }

  return (
    <AnimatePresence>
      {formAberto && (
        <motion.div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={fecharForm}>
          <motion.div
            className="bg-soft w-full max-w-md rounded-t-3xl max-h-[92dvh] overflow-y-auto no-scrollbar"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-soft px-5 pt-3 pb-2 flex items-center justify-between">
              <div className="w-10 h-1 bg-slate-300 rounded-full absolute left-1/2 -translate-x-1/2 top-1.5" />
              <h2 className="text-base font-medium text-ink mt-2">{agendaEmEdicao ? "Editar agenda" : "Nova agenda"}</h2>
              <button onClick={fecharForm} className="text-muted text-sm mt-2">Fechar</button>
            </div>

            <div className="px-5 pb-8 space-y-3">
              {/* Toggle tipo */}
              <div className="grid grid-cols-2 gap-2 bg-white border border-slate-200 rounded-xl p-1">
                {(["prefeitura", "prefeito"] as TipoAgenda[]).map((t) => (
                  <button key={t} onClick={() => set("tipo", t)}
                    className={`py-2 rounded-lg text-[12px] font-medium transition ${f.tipo === t ? "bg-navy text-white" : "text-muted"}`}>
                    {t === "prefeitura" ? "Agenda da Prefeitura" : "👑 Agenda do Prefeito"}
                  </button>
                ))}
              </div>

              <Campo label="Assunto / Título">
                <input className="inp" value={f.titulo || ""} onChange={(e) => set("titulo", e.target.value)} placeholder="Ex.: Inauguração da UBS" />
              </Campo>

              <div className="grid grid-cols-2 gap-3">
                <Campo label="Data"><input type="date" className="inp" value={f.data || ""} onChange={(e) => set("data", e.target.value)} /></Campo>
                <Campo label="Tipo de cobertura">
                  <select className="inp" value={f.tipoCobertura || ""} onChange={(e) => set("tipoCobertura", e.target.value)}>
                    {COBERTURAS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Campo>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Campo label="Início"><input type="time" className="inp" value={f.horaInicio || ""} onChange={(e) => set("horaInicio", e.target.value)} /></Campo>
                <Campo label="Fim"><input type="time" className="inp" value={f.horaFim || ""} onChange={(e) => set("horaFim", e.target.value)} /></Campo>
              </div>

              <Campo label="Local"><input className="inp" value={f.local || ""} onChange={(e) => set("local", e.target.value)} placeholder="Ex.: Paço Municipal" /></Campo>

              <Campo label="Endereço (para a rota)">
                <input className="inp" value={f.endereco || ""} onChange={(e) => set("endereco", e.target.value)} placeholder="Rua, número — bairro, cidade" />
                <button onClick={usarLocalizacao} className="text-[11px] text-brand mt-1.5">📍 Usar minha localização atual</button>
                {geo && <p className="text-[11px] text-muted mt-1">{geo}</p>}
              </Campo>

              <Campo label="Responsáveis (selecione 1 ou mais)">
                <div className="flex flex-wrap gap-2">
                  {db.equipe.map((m) => {
                    const on = (f.responsaveis || []).includes(m.id);
                    return (
                      <button key={m.id} onClick={() => toggleResp(m.id)}
                        className={`text-[12px] px-3 py-1.5 rounded-full border ${on ? "bg-brand text-white border-brand" : "bg-white border-slate-200 text-muted"}`}>
                        {m.nome}
                      </button>
                    );
                  })}
                </div>
              </Campo>

              <Campo label="Observações">
                <textarea className="inp" rows={2} value={f.observacoes || ""} onChange={(e) => set("observacoes", e.target.value)} placeholder="Equipamentos, contatos, etc." />
              </Campo>

              <button onClick={salvar} className="w-full btn-brand rounded-xl py-3.5 font-semibold transition">
                {agendaEmEdicao ? "Salvar alterações" : "Adicionar agenda"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] text-muted block mb-1">{label}</label>
      {children}
    </div>
  );
}
