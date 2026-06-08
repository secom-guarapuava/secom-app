"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface T { id: number; msg: string }

export default function ToastViewport() {
  const [toasts, setToasts] = useState<T[]>([]);

  useEffect(() => {
    let n = 0;
    const onToast = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail;
      const id = ++n;
      setToasts((t) => [...t, { id, msg }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    };
    window.addEventListener("secom:toast", onToast as EventListener);
    return () => window.removeEventListener("secom:toast", onToast as EventListener);
  }, []);

  return (
    <div className="fixed top-2 inset-x-0 z-[60] flex flex-col items-center gap-2 px-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="max-w-[90%] bg-navy-grad text-white text-[12px] font-medium px-4 py-2.5 rounded-full shadow-navy flex items-center gap-2 pointer-events-auto"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
