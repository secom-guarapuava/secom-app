"use client";

import { tocarAudio } from "@/lib/voz";

function OndasAudio() {
  const alturas = [5, 12, 16, 8, 14, 6, 11];
  return (
    <div className="ml-auto flex items-end gap-[2px] h-4 opacity-90" aria-hidden>
      {alturas.map((h, i) => (
        <span key={i} className="w-[2px] rounded-full bg-brand-400 origin-bottom animate-equalize"
          style={{ height: h, animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}

export default function AppHeader() {
  return (
    <header className="relative bg-navy-grad text-white px-4 pt-3.5 pb-3.5 sticky top-0 z-20 glow-top shadow-navy">
      <div className="relative flex items-center gap-3">
        <button onClick={() => tocarAudio()} aria-label="Ouvir áudio"
          className="w-10 h-10 rounded-xl bg-brand-grad grid place-items-center text-white active:scale-95 transition shadow-float">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 14a8 8 0 0 1 16 0" /><path d="M2 18h4" /><path d="M18 18h4" /><circle cx="12" cy="14" r="2.5" />
          </svg>
        </button>
        <div className="leading-tight">
          <div className="text-[14px] font-bold tracking-wide">COMUNICAÇÃO</div>
          <div className="text-[9px] text-slate-300 tracking-[2px]">SECOM · CENTRAL DE OPERAÇÕES</div>
        </div>
        <OndasAudio />
      </div>
    </header>
  );
}
