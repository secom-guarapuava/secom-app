"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useDB } from "@/lib/store";
import { parsePlantao, plantaoDeHoje, acharMembro } from "@/lib/plantao";
import { chaveDataHora, ehHoje, hojeISO, rotuloData } from "@/lib/datas";
import MetricCard from "@/components/MetricCard";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const ACESSOS = [
  { href: "/agendas", label: "Agendas", icon: "M3 9h18M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9M3 9l1-4a2 2 0 0 1 2-1.5h12A2 2 0 0 1 20 5l1 4M8 2v4M16 2v4" },
  { href: "/equipe", label: "Equipe", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" },
  { href: "/plantao", label: "Plantão", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" },
];

export default function Inicio() {
  const db = useDB();
  const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  const emAndamento = db.agendas.filter((a) => a.status === "em_andamento");
  const agendasHoje = db.agendas.filter((a) => ehHoje(a.data));
  const proxima = db.agendas
    .filter((a) => a.status === "agendada" || a.status === "em_deslocamento")
    .filter((a) => !a.data || a.data >= hojeISO()) // ignora dias que já passaram
    .sort((a, b) => chaveDataHora(a).localeCompare(chaveDataHora(b)))[0];

  const plantaoHoje = plantaoDeHoje(parsePlantao(db.plantaoTexto));

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[22px] font-bold text-ink leading-tight">{saudacao()}, Equipe SECOM 👋</h1>
        <p className="text-[12px] text-muted capitalize mt-0.5">{hoje}</p>
      </motion.div>

      {plantaoHoje && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-brand-50 border border-brand/25 rounded-2xl px-3.5 py-3 flex items-center gap-2.5 shadow-card">
          <span className="w-8 h-8 rounded-xl bg-brand-grad grid place-items-center text-white text-sm shrink-0">🔔</span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-brand-600 font-bold tracking-wide">PLANTÃO DE HOJE</div>
            <div className="text-[13px] text-ink font-medium truncate">{plantaoHoje.nomes.join(", ")}</div>
          </div>
          {plantaoHoje.nomes.map((n) => {
            const m = acharMembro(n, db.equipe);
            return m?.telefone ? (
              <a key={n} href={`tel:${m.telefone.replace(/\D/g, "")}`} className="text-[11px] font-medium text-white bg-brand rounded-full px-2.5 py-1 shrink-0">📞 {m.nome.split(" ")[0]}</a>
            ) : null;
          })}
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <MetricCard label="Agendas hoje" valor={agendasHoje.length} icon="M3 9h18M8 2v4M16 2v4M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        <MetricCard label="Ao vivo agora" valor={emAndamento.length} destaque icon="M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4" />
        <MetricCard label="Próxima" valor={proxima?.horaInicio || "—"} icon="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
        <MetricCard label="Equipe" valor={db.equipe.length} icon="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
      </div>

      {proxima && (
        <Link href="/agendas" className="relative block bg-navy-grad text-white rounded-2xl p-4 mt-3 shadow-navy glow-top overflow-hidden active:scale-[0.99] transition">
          <div className="relative">
            <div className="text-[10px] text-slate-300 font-semibold tracking-wide">PRÓXIMA AGENDA</div>
            <div className="font-semibold mt-1 text-[15px]">{proxima.titulo}</div>
            <div className="text-[12px] text-slate-200 mt-1.5 flex items-center gap-3 flex-wrap">
              {!ehHoje(proxima.data) && (
                <span className="bg-white/15 rounded-full px-2 py-0.5 text-[11px] font-medium">{rotuloData(proxima.data)}</span>
              )}
              <span>🕐 {proxima.horaInicio}</span><span>📍 {proxima.local}</span>
            </div>
          </div>
        </Link>
      )}

      <p className="text-[12px] text-muted font-medium mt-5 mb-2">Acesso rápido</p>
      <div className="grid grid-cols-3 gap-2.5">
        {ACESSOS.map((a) => (
          <Link key={a.href} href={a.href}
            className="bg-white border border-slate-200/80 rounded-2xl py-4 flex flex-col items-center gap-2 text-[12px] font-medium text-ink active:scale-[0.97] transition shadow-card">
            <span className="w-10 h-10 rounded-xl bg-navy/5 text-navy grid place-items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon} /></svg>
            </span>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
