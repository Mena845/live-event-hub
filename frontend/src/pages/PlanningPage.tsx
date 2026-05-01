"use client";

import { useParams } from "react-router-dom";
import { rooms, sessions, events, isLive } from "@/lib/mockData";
import { SessionCard } from "@/components/SessionCard";
import { useNow } from "@/hooks/useNow";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function PlanningPage() {
  const { eventId = "ev1" } = useParams();
  const ev = events.find((e) => e.id === eventId);
  const now = useNow();
  // Vue mobile : une salle à la fois
  const [activeRoom, setActiveRoom] = useState(rooms[0]?.id ?? "");

  if (!ev) return <div className="p-10">Événement introuvable.</div>;

  const evSessions = sessions.filter((s) => s.eventId === ev.id);

  return (
    // ✅ Suppression du ml-45 hardcodé — mx-auto ou flush-left selon contexte
    <div className="py-8 max-w-[1400px] mx-auto w-full">
      <div className="px-4 sm:px-8 mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Planning multi-track</h1>
        <p className="text-muted-foreground mt-1">{ev.title}</p>
      </div>

      {/* Sélecteur de salle — visible sur mobile uniquement */}
      <div className="md:hidden px-4 mb-4 flex gap-2 overflow-x-auto pb-1">
        {rooms.map((room) => {
          const liveCount = evSessions.filter(
            (s) => s.roomId === room.id && isLive(s, now)
          ).length;
          return (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-smooth",
                activeRoom === room.id
                  ? "bg-gradient-primary text-primary-foreground border-0 shadow-glow"
                  : "border-border/60 text-muted-foreground hover:text-foreground bg-card/40"
              )}
            >
              {room.name}
              {liveCount > 0 && (
                <span className="ml-1.5 text-[10px] text-live-glow font-bold">● LIVE</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grille desktop : toutes les salles côte à côte */}
      <div className="hidden md:grid gap-5 px-4 sm:px-8"
        style={{ gridTemplateColumns: `repeat(${rooms.length}, minmax(0, 1fr))` }}
      >
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

      {/* Vue mobile : une seule salle */}
      <div className="md:hidden px-4">
        {rooms.map((room) => {
          if (room.id !== activeRoom) return null;
          const list = evSessions
            .filter((s) => s.roomId === room.id)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
          return (
            <div key={room.id} className="flex flex-col gap-3">
              {list.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
              {list.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune session.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}