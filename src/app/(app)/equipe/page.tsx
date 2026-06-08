"use client";

import { useState } from "react";
import { useDB, adicionarMembro, removerMembro, atualizarMembro } from "@/lib/store";
import type { Setor } from "@/lib/types";

export default function Equipe() {
  const db = useDB();
  const [novoNome, setNovoNome] = useState("");
  const [novoSetor, setNovoSetor] = useState<Setor>("REDES");

  function adicionar() {
    if (!novoNome.trim()) return;
    adicionarMembro({ nome: novoNome.trim(), setor: novoSetor, telefone: "" });
    setNovoNome("");
  }

  const setores: Setor[] = ["REDES", "JOR"];

  return (
    <div>
      <h1 className="text-[22px] font-bold text-ink mb-3">Equipe SECOM</h1>

      {/* adicionar membro */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 mb-4 shadow-card">
        <div className="flex gap-2">
          <input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome da pessoa"
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand" />
          <select value={novoSetor} onChange={(e) => setNovoSetor(e.target.value as Setor)}
            className="px-2 rounded-xl border border-slate-200 text-sm">
            {setores.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={adicionar} aria-label="Adicionar membro" className="btn-brand rounded-xl w-11 grid place-items-center text-xl font-bold">+</button>
        </div>
      </div>

      {setores.map((setor) => (
        <div key={setor} className="mb-4">
          <p className="text-[11px] text-muted font-bold tracking-wide mb-2 uppercase">{setor}</p>
          {db.equipe.filter((m) => m.setor === setor).map((m) => (
            <div key={m.id} className="bg-white border border-slate-200/80 rounded-2xl p-3 mb-2 flex items-center gap-3 shadow-card">
              <div className="w-11 h-11 rounded-full bg-navy-grad text-white grid place-items-center text-[13px] font-bold shrink-0">
                {m.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-ink text-[13px]">{m.nome}</div>
                <input
                  defaultValue={m.telefone || ""}
                  onBlur={(e) => atualizarMembro(m.id, { telefone: e.target.value })}
                  placeholder="Adicionar telefone…"
                  className="text-[11px] text-muted outline-none bg-transparent w-full mt-0.5"
                />
              </div>
              {m.telefone && (
                <a href={`tel:${m.telefone.replace(/\D/g, "")}`} className="text-brand text-lg shrink-0">📞</a>
              )}
              <button onClick={() => { if (confirm(`Remover ${m.nome} da equipe?`)) removerMembro(m.id); }}
                className="text-red-500 text-xs shrink-0">✕</button>
            </div>
          ))}
          {db.equipe.filter((m) => m.setor === setor).length === 0 && (
            <p className="text-[12px] text-muted">Ninguém neste setor.</p>
          )}
        </div>
      ))}

      <p className="text-[11px] text-muted mt-2">
        Toque no campo de telefone para preencher — assim o número fica disponível para ligar no plantão e nas agendas.
      </p>
    </div>
  );
}
