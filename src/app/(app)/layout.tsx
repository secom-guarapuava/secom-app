import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import FloatingAdd from "@/components/FloatingAdd";
import AgendaForm from "@/components/AgendaForm";
import AgendaDrawer from "@/components/AgendaDrawer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto no-scrollbar px-4 py-4"
        style={{ paddingBottom: "calc(96px + env(safe-area-inset-bottom))" }}>
        {children}
      </main>
      <FloatingAdd />
      <AgendaForm />
      <AgendaDrawer />
      <BottomNav />
    </div>
  );
}
