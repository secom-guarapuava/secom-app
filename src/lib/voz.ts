"use client";
// Voz / audio institucional. Toca um MP3 externo customizavel
// (ex.: o audio do chefe perguntando "Qual a agenda de hoje?").
// Se o arquivo nao existir, usa a voz sintetizada do navegador.

import { asset } from "./paths";

export const AUDIO_PADRAO = "/audio/abertura.mp3";

export async function tocarAudio(caminho: string = AUDIO_PADRAO, textoFallback = "Qual a agenda de hoje?") {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio(caminho.startsWith("http") ? caminho : asset(caminho));
    await audio.play();
  } catch {
    falar(textoFallback);
  }
}

export function falar(texto: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "pt-BR";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
