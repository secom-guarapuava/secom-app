export default function MetricCard({
  label, valor, destaque = false, icon,
}: { label: string; valor: string | number; destaque?: boolean; icon?: string }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl px-3.5 py-3 shadow-card">
      <div className="flex items-center gap-2">
        {icon && (
          <span className={`w-7 h-7 rounded-lg grid place-items-center ${destaque ? "bg-emerald-50 text-emerald-600" : "bg-navy/5 text-navy"}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
          </span>
        )}
        <div className="text-[11px] text-muted">{label}</div>
      </div>
      <div className={`text-[26px] font-bold mt-1.5 leading-none ${destaque ? "text-emerald-600" : "text-ink"}`}>{valor}</div>
    </div>
  );
}
