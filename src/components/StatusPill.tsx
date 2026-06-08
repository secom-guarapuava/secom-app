import { STATUS } from "@/lib/status";
import type { StatusAgenda } from "@/lib/types";

export default function StatusPill({ status }: { status: StatusAgenda }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${s.pill}`}>
      {status === "em_andamento" ? (
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulseLive`} />
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d={s.icon} />
        </svg>
      )}
      {s.label}
    </span>
  );
}
