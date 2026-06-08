"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDB, emitirToast } from "@/lib/store";
import { useUI } from "@/components/UIProvider";
import { responder, SUGESTOES } from "@/lib/assistente";
import { falar } from "@/lib/voz";
import type { Agenda } from "@/lib/types";

interface Msg { de: "eu" | "bot"; texto: string; agendas?: Agenda[]; audioUrl?: string; duracao?: number }

function mmss(seg: number) {
  const m = Math.floor(seg / 60);
  const s = Math.floor(seg % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Assistente() {
  const db = useDB();
  const { verDetalhe } = useUI();
  const [msgs, setMsgs] = useState<Msg[]>([
    { de: "bot", texto: "Olá! 👋 Posso filtrar agendas por assunto, local, hora ou tipo, e conferir o plantão.\nDigite, ou toque no microfone para perguntar falando." },
  ]);
  const [texto, setTexto] = useState("");
  const [gravando, setGravando] = useState(false);
  const [recSeg, setRecSeg] = useState(0);
  const [parcial, setParcial] = useState("");
  const fimRef = useRef<HTMLDivElement>(null);

  // refs de gravação
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcricaoRef = useRef("");
  const segRef = useRef(0);
  const canceladoRef = useRef(false);

  const rolar = () => setTimeout(() => fimRef.current?.scrollIntoView({ behavior: "smooth" }), 60);

  function responderBot(q: string) {
    const r = responder(q, db.agendas, db.equipe, db.plantaoTexto);
    setMsgs((m) => [...m, { de: "bot", texto: r.texto, agendas: r.agendas }]);
    falar(r.texto.replace(/[•\n]/g, " "));
    rolar();
  }

  function perguntar(q: string) {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { de: "eu", texto: q }]);
    setTexto("");
    responderBot(q);
  }

  // ---------- GRAVAÇÃO DE ÁUDIO + TRANSCRIÇÃO ----------
  async function iniciarGravacao() {
    if (gravando) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      emitirToast("Gravação de áudio não suportada neste navegador.");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      emitirToast("Não foi possível acessar o microfone. Verifique a permissão.");
      return;
    }

    canceladoRef.current = false;
    transcricaoRef.current = "";
    chunksRef.current = [];
    segRef.current = 0;
    setRecSeg(0);
    setParcial("");
    streamRef.current = stream;

    // MediaRecorder -> grava o áudio
    let mr: MediaRecorder;
    try {
      mr = new MediaRecorder(stream);
    } catch {
      stream.getTracks().forEach((t) => t.stop());
      emitirToast("Gravação não suportada neste navegador.");
      return;
    }
    mediaRef.current = mr;
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const dur = segRef.current;
      if (canceladoRef.current) return;
      const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
      const url = URL.createObjectURL(blob);
      const q = transcricaoRef.current.trim();
      setMsgs((m) => [...m, { de: "eu", texto: q, audioUrl: url, duracao: dur }]);
      rolar();
      if (q) {
        responderBot(q);
      } else {
        setMsgs((m) => [...m, {
          de: "bot",
          texto: "Recebi seu áudio 🎧 — toque para ouvir.\nA transcrição automática não está disponível neste navegador (funciona melhor no Chrome do Android). Você também pode digitar a pergunta.",
        }]);
        rolar();
      }
    };
    mr.start();

    // SpeechRecognition -> transcreve em paralelo (quando suportado)
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      try {
        const rec = new SR();
        rec.lang = "pt-BR";
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (e: any) => {
          let fin = "", inter = "";
          for (let i = 0; i < e.results.length; i++) {
            const t = e.results[i][0].transcript;
            if (e.results[i].isFinal) fin += t; else inter += t;
          }
          if (fin) transcricaoRef.current = fin;
          setParcial((fin + " " + inter).trim());
        };
        rec.onerror = () => {};
        recRef.current = rec;
        rec.start();
      } catch { recRef.current = null; }
    }

    setGravando(true);
    timerRef.current = setInterval(() => {
      segRef.current += 1;
      setRecSeg(segRef.current);
      if (segRef.current >= 120) pararGravacao(); // limite de segurança: 2 min
    }, 1000);
  }

  function encerrarCaptura() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    try { recRef.current?.stop(); } catch {}
    recRef.current = null;
    try { if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop(); } catch {}
    setGravando(false);
    setParcial("");
  }

  function pararGravacao() {
    canceladoRef.current = false;
    encerrarCaptura();
  }

  function cancelarGravacao() {
    canceladoRef.current = true;
    encerrarCaptura();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  useEffect(() => () => { // limpeza ao sair da tela
    if (timerRef.current) clearInterval(timerRef.current);
    try { recRef.current?.stop(); } catch {}
    try { mediaRef.current?.stop(); } catch {}
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100dvh_-_188px)]">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-9 h-9 rounded-xl bg-navy-grad grid place-items-center text-base shadow-navy">🤖</span>
        <div>
          <h1 className="text-[17px] font-semibold text-ink leading-none">Assistente</h1>
          <p className="text-[11px] text-muted mt-1">Pergunte por texto ou voz</p>
        </div>
      </div>

      <div className="flex-1 space-y-2.5">
        {msgs.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.de === "eu" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-3.5 py-2.5 text-[12.5px] leading-relaxed whitespace-pre-line shadow-card
              ${m.de === "eu" ? "bg-navy-grad text-white rounded-2xl rounded-br-md" : "bg-white border border-slate-200/80 text-ink rounded-2xl rounded-bl-md"}`}>
              {m.audioUrl && <AudioMsg url={m.audioUrl} dur={m.duracao || 0} escuro={m.de === "eu"} />}
              {m.texto && <span>{m.texto}</span>}
              {m.agendas && m.agendas.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {m.agendas.map((a) => (
                    <button key={a.id} onClick={() => verDetalhe(a)}
                      className="flex items-center gap-1.5 text-brand-600 text-[11.5px] font-medium bg-brand-50 rounded-lg px-2.5 py-1.5 text-left w-full">
                      <span>→</span> {a.titulo} <span className="text-muted font-normal ml-auto">{a.horaInicio}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={fimRef} />
      </div>

      <div className="mt-3 sticky bottom-0">
        {!gravando && (
          <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar pb-0.5">
            {SUGESTOES.map((s) => (
              <button key={s} onClick={() => perguntar(s)}
                className="whitespace-nowrap text-[11px] border border-slate-200 bg-white text-navy rounded-full px-3 py-1.5 shadow-card active:scale-95 transition">{s}</button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {gravando ? (
            <motion.div key="rec" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-white border border-red-200 shadow-card">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-recPulse shrink-0" />
              <span className="text-[13px] tabular-nums font-semibold text-ink shrink-0">{mmss(recSeg)}</span>
              <span className="text-[11.5px] text-muted truncate flex-1">{parcial || "Ouvindo… pode falar"}</span>
              <button onClick={cancelarGravacao} aria-label="Cancelar gravação"
                className="w-9 h-9 rounded-full bg-slate-100 grid place-items-center text-muted shrink-0 active:scale-90 transition">
                <Icon path="M18 6 6 18M6 6l12 12" />
              </button>
              <button onClick={pararGravacao} aria-label="Enviar áudio"
                className="w-9 h-9 rounded-full bg-brand-grad text-white grid place-items-center shadow-float shrink-0 active:scale-90 transition">
                <Icon path="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
              <input value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && perguntar(texto)}
                placeholder="Pergunte algo…"
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none bg-white shadow-card focus:border-brand focus:shadow-[0_0_0_3px_rgba(226,98,47,0.12)] transition" />
              <button onClick={iniciarGravacao} aria-label="Gravar áudio"
                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 grid place-items-center text-navy shadow-card active:scale-90 transition shrink-0">
                <Icon path="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />
              </button>
              <button onClick={() => perguntar(texto)} aria-label="Enviar" disabled={!texto.trim()}
                className="w-12 h-12 rounded-2xl bg-brand-grad text-white grid place-items-center shadow-float active:scale-90 transition shrink-0 disabled:opacity-40 disabled:shadow-none">
                <Icon path="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

function AudioMsg({ url, dur, escuro }: { url: string; dur: number; escuro: boolean }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [tocando, setTocando] = useState(false);
  const barras = [6, 12, 18, 10, 16, 8, 14, 9, 13, 7];
  return (
    <div className="flex items-center gap-2.5 min-w-[170px] py-0.5">
      <button
        onClick={() => { const a = ref.current; if (!a) return; tocando ? a.pause() : a.play(); }}
        className={`w-9 h-9 rounded-full grid place-items-center shrink-0 ${escuro ? "bg-white/20" : "bg-brand-50 text-brand-600"}`}
        aria-label={tocando ? "Pausar" : "Tocar"}>
        {tocando
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>}
      </button>
      <div className="flex items-center gap-[2px] h-5 flex-1">
        {barras.map((h, i) => (
          <span key={i}
            className={`w-[2.5px] rounded-full origin-center ${escuro ? "bg-white/70" : "bg-brand/60"} ${tocando ? "animate-equalize" : ""}`}
            style={{ height: h, animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
      <span className={`text-[10px] tabular-nums shrink-0 ${escuro ? "text-white/80" : "text-muted"}`}>{mmss(dur)}</span>
      <audio ref={ref} src={url} preload="metadata" className="hidden"
        onPlay={() => setTocando(true)} onPause={() => setTocando(false)} onEnded={() => setTocando(false)} />
    </div>
  );
}
