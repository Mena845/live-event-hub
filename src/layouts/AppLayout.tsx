import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useNow } from "@/hooks/useNow";
import { sessions, isLive } from "@/lib/mockData";
import { LiveBadge } from "@/components/LiveBadge";

export default function AppLayout() {
  const now = useNow(15_000);
  const liveCount = sessions.filter((s) => isLive(s, now)).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-hero">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border/60 bg-background/40 backdrop-blur-md px-3 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                EAT · Antananarivo
              </span>
            </div>
            {liveCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <LiveBadge />
                <span>
                  {liveCount} session{liveCount > 1 ? "s" : ""} en direct
                </span>
              </div>
            )}
          </header>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}