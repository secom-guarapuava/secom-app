"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const ITENS = [
  { href: "/inicio", label: "Início", icon: IconHome },
  { href: "/agendas", label: "Agendas", icon: IconCal },
  { href: "/agora", label: "Agora", icon: IconBroadcast },
  { href: "/plantao", label: "Plantão", icon: IconPlantao },
  { href: "/assistente", label: "Assistente", icon: IconRobo },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-slate-200/80 z-30 shadow-nav"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}>
      <ul className="flex pt-1.5">
        {ITENS.map(({ href, label, icon: Icon }) => {
          const ativo = path === href || path.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link href={href} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${ativo ? "text-brand-600" : "text-muted"}`}>
                <span className="relative grid place-items-center w-[52px] h-8">
                  {ativo && <motion.span layoutId="navpill" className="absolute inset-0 bg-brand-50 rounded-full" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                  <Icon className="relative w-[22px] h-[22px]" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type P = { className?: string };
const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
function IconHome({ className }: P) { return (<svg viewBox="0 0 24 24" className={className} {...s}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>); }
function IconCal({ className }: P) { return (<svg viewBox="0 0 24 24" className={className} {...s}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>); }
function IconBroadcast({ className }: P) { return (<svg viewBox="0 0 24 24" className={className} {...s}><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" /></svg>); }
function IconPlantao({ className }: P) { return (<svg viewBox="0 0 24 24" className={className} {...s}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>); }
function IconRobo({ className }: P) { return (<svg viewBox="0 0 24 24" className={className} {...s}><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 8V4M9 13h.01M15 13h.01" /></svg>); }
