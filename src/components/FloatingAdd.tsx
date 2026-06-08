"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useUI } from "./UIProvider";

// Telas onde o "+" NÃO deve aparecer (evita sobrepor a barra do Assistente
// e ações próprias dessas páginas).
const OCULTAR_EM = ["/assistente", "/equipe", "/plantao"];

export default function FloatingAdd() {
  const { abrirNova } = useUI();
  const path = usePathname();
  const oculto = OCULTAR_EM.some((p) => path === p || path.startsWith(p + "/"));

  return (
    <AnimatePresence>
      {!oculto && (
        <motion.button
          onClick={abrirNova}
          aria-label="Nova agenda"
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="fixed z-40 right-[max(16px,calc(50vw_-_208px))] bottom-[92px] w-14 h-14 rounded-full bg-brand-grad text-white shadow-float grid place-items-center"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
