"use client";

// Inicialização do Firebase (apenas no navegador). Fica INATIVO enquanto
// firebaseConfig.ts não estiver preenchido — então o app continua usando o
// armazenamento local. Login é anônimo (sem tela de login).

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { FIREBASE_CONFIG } from "./firebaseConfig";

export const firebaseAtivo = !!FIREBASE_CONFIG.apiKey && typeof FIREBASE_CONFIG.apiKey === "string";

let _db: Firestore | null = null;

function app(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
}

export function getDb(): Firestore | null {
  if (!firebaseAtivo || typeof window === "undefined") return null;
  if (!_db) _db = getFirestore(app());
  return _db;
}

// Garante que o usuário esteja autenticado (anônimo) antes de ler/escrever.
export function garantirLogin(): Promise<void> {
  if (!firebaseAtivo || typeof window === "undefined") return Promise.resolve();
  const auth = getAuth(app());
  if (auth.currentUser) return Promise.resolve();
  return signInAnonymously(auth).then(() => undefined).catch(() => undefined);
}
