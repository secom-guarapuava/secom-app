"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Agenda } from "@/lib/types";

interface UICtx {
  // formulario (criar/editar)
  formAberto: boolean;
  agendaEmEdicao: Agenda | null;
  abrirNova: () => void;
  editar: (a: Agenda) => void;
  fecharForm: () => void;
  // detalhe (drawer)
  detalhe: Agenda | null;
  verDetalhe: (a: Agenda) => void;
  fecharDetalhe: () => void;
}

const Ctx = createContext<UICtx | null>(null);
export const useUI = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUI fora do provider");
  return c;
};

export function UIProvider({ children }: { children: ReactNode }) {
  const [formAberto, setFormAberto] = useState(false);
  const [agendaEmEdicao, setAgendaEmEdicao] = useState<Agenda | null>(null);
  const [detalhe, setDetalhe] = useState<Agenda | null>(null);

  return (
    <Ctx.Provider
      value={{
        formAberto,
        agendaEmEdicao,
        abrirNova: () => { setAgendaEmEdicao(null); setFormAberto(true); },
        editar: (a) => { setDetalhe(null); setAgendaEmEdicao(a); setFormAberto(true); },
        fecharForm: () => { setFormAberto(false); setAgendaEmEdicao(null); },
        detalhe,
        verDetalhe: (a) => setDetalhe(a),
        fecharDetalhe: () => setDetalhe(null),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
