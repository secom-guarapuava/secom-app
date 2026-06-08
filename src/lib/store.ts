"use client";

import { useSyncExternalStore } from "react";
import type { Agenda, Membro } from "./types";
import { SEED_AGENDAS, SEED_EQUIPE } from "./seed";
import { parsePlantao } from "./plantao";
import { STATUS } from "./status";
import { firebaseAtivo, getDb, garantirLogin } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

interface DB {
  agendas: Agenda[];
  equipe: Membro[];
  plantaoTexto: string;
}

const KEY = "secom_db_v2";
const COL = "secom";       // coleção no Firestore
const DOC = "app";         // documento único com todo o estado da equipe
const listeners = new Set<() => void>();

function semInicial(): DB {
  return { agendas: SEED_AGENDAS, equipe: SEED_EQUIPE, plantaoTexto: "" };
}

// snapshot estavel para o servidor (export estatico)
const SERVER_SNAPSHOT: DB = semInicial();

let cache: DB | null = null;

function normalizar(d: Partial<DB> | undefined): DB {
  return {
    agendas: Array.isArray(d?.agendas) ? d!.agendas : [],
    equipe: Array.isArray(d?.equipe) ? d!.equipe : [],
    plantaoTexto: typeof d?.plantaoTexto === "string" ? d!.plantaoTexto : "",
  };
}

function lerLocal(): DB {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalizar(JSON.parse(raw)) : semInicial();
  } catch {
    return semInicial();
  }
}

function ler(): DB {
  if (cache) return cache;
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  cache = lerLocal();
  return cache;
}

function espelharLocal(d: DB) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
}

function gravar(novo: DB, toast?: string) {
  cache = novo; // nova referencia -> dispara re-render no useSyncExternalStore
  if (typeof window !== "undefined") {
    espelharLocal(novo); // espelho local (paint instantâneo + offline)
    if (firebaseAtivo) {
      const fb = getDb();
      if (fb) setDoc(doc(fb, COL, DOC), novo).catch(() => {});
    }
    if (toast) emitirToast(toast);
  }
  listeners.forEach((l) => l());
}

export function emitirToast(msg: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("secom:toast", { detail: msg }));
  }
}

// ----- Firestore em tempo real (nuvem) -----
let snapIniciado = false;
async function iniciarFirestore() {
  if (snapIniciado || !firebaseAtivo || typeof window === "undefined") return;
  const fb = getDb();
  if (!fb) return;
  snapIniciado = true;
  try { await garantirLogin(); } catch {}
  onSnapshot(
    doc(fb, COL, DOC),
    (snap) => {
      if (!snap.exists()) {
        // Primeira vez: semeia o documento compartilhado com dados de exemplo.
        setDoc(doc(fb, COL, DOC), semInicial()).catch(() => {});
        return;
      }
      cache = normalizar(snap.data() as Partial<DB>);
      espelharLocal(cache);
      listeners.forEach((l) => l());
    },
    () => { /* erro de rede/permissão: segue com o espelho local */ }
  );
}

// ----- assinatura para hooks -----
function subscribe(cb: () => void) {
  listeners.add(cb);
  if (firebaseAtivo) iniciarFirestore();

  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY && !firebaseAtivo) {
      cache = null; // forca releitura na proxima chamada
      emitirToast("Atualizado em outro dispositivo/aba");
      listeners.forEach((l) => l());
    }
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => ler();
const getServerSnapshot = () => SERVER_SNAPSHOT;

export function useDB(): DB {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const id = () => Math.random().toString(36).slice(2, 9);

// ===== AGENDAS =====
export function salvarAgenda(dados: Partial<Agenda> & { id?: string }) {
  const db = ler();
  if (dados.id && db.agendas.some((a) => a.id === dados.id)) {
    const agendas = db.agendas.map((a) => (a.id === dados.id ? { ...a, ...dados } as Agenda : a));
    gravar({ ...db, agendas }, "Agenda atualizada");
  } else {
    const nova: Agenda = {
      id: id(), status: "agendada", tipo: "prefeitura", responsaveis: [],
      data: "", horaInicio: "", local: "", endereco: "", titulo: "",
      criadaEmISO: new Date().toISOString(),
      ...dados,
    };
    gravar({ ...db, agendas: [...db.agendas, nova] }, `Nova agenda: ${nova.titulo}`);
  }
}

export function excluirAgenda(idAgenda: string) {
  const db = ler();
  gravar({ ...db, agendas: db.agendas.filter((a) => a.id !== idAgenda) });
}

export function mudarStatus(idAgenda: string, status: Agenda["status"]) {
  const db = ler();
  gravar(
    { ...db, agendas: db.agendas.map((a) => (a.id === idAgenda ? { ...a, status } : a)) },
    `Status atualizado: ${STATUS[status].label}`
  );
}

// ===== EQUIPE =====
export function adicionarMembro(m: Omit<Membro, "id">) {
  const db = ler();
  gravar({ ...db, equipe: [...db.equipe, { ...m, id: id() }] }, `${m.nome} adicionado(a) à equipe`);
}

export function atualizarMembro(idMembro: string, dados: Partial<Membro>) {
  const db = ler();
  gravar({ ...db, equipe: db.equipe.map((m) => (m.id === idMembro ? { ...m, ...dados } : m)) });
}

export function removerMembro(idMembro: string) {
  const db = ler();
  gravar({ ...db, equipe: db.equipe.filter((m) => m.id !== idMembro) });
}

// ===== PLANTAO =====
export function salvarPlantao(texto: string) {
  const db = ler();
  gravar({ ...db, plantaoTexto: texto }, "Escala de plantão atualizada");
}

export function plantaoOrganizado(texto: string) {
  return parsePlantao(texto);
}

// restaura dados de exemplo
export function restaurarExemplos() {
  gravar(semInicial(), "Dados de exemplo restaurados");
}
