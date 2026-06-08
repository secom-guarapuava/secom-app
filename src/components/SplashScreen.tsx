"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { tocarAudio } from "@/lib/voz";

export default function SplashScreen({ aoConcluir }: { aoConcluir: () => void }) {
  useEffect(() => {
    const t = setTimeout(aoConcluir, 2100);
    return () => clearTimeout(t);
  }, [aoConcluir]);

  return (
    <div className="fixed inset-0 bg-navy-grad grid place-items-center z-50" onClick={() => tocarAudio()}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-grad grid place-items-center mb-4 shadow-float">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4" />
          </svg>
        </div>
        <div className="text-white text-lg font-semibold tracking-wider">COMUNICAÇÃO</div>
        <div className="text-slate-300 text-[10px] tracking-[3px] mt-1">SECOM · CENTRAL DE OPERAÇÕES</div>
        <div className="flex items-end gap-1 h-6 mt-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span key={i} className="w-1 bg-brand rounded-full" animate={{ scaleY: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.12 }} style={{ height: 24, transformOrigin: "bottom" }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
