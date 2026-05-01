"use client";

import { useParams } from "react-router-dom";
import { rooms, sessions, events, isLive } from "@/lib/mockData";
import { SessionCard } from "@/components/SessionCard";
import { useNow } from "@/hooks/useNow";

export default function PlanningPage() {
  const { eventId = "ev1" } = useParams();
  const ev = events.find((e) => e.id === eventId);
  const now = useNow();

  if (!ev) return <div className="p-10">Événement introuvable.</div>;

  const evSessions = sessions.filter((s) => s.eventId === ev.id);

  return (
    <div className="px-4 sm:px-8 py-8 max-w-[1400px] ml-45 w-full">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Planning multi-track</h1>
        <p className="text-muted-foreground mt-1">{ev.title}</p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${rooms.length}, minmax(0, 1fr))` }}>
        {rooms.map((room) => {
          const list = evSessions
            .filter((s) => s.roomId === room.id)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
          const liveCount = list.filter((s) => isLive(s, now)).length;
          return (
            <div key={room.id} className="min-w-0">
              <div className="sticky top-14 z-20 bg-background/70 backdrop-blur-md py-3 mb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold text-lg">{room.name}</h2>
                  {liveCount > 0 && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-live/20 text-live-glow">
                      {liveCount} live
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {list.map((s) => (
                  <SessionCard key={s.id} session={s} compact />
                ))}
                {list.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune session.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}