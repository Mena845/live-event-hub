"use client";

import { sessions, isLive } from "@/lib/mockData";
import { SessionCard } from "@/components/SessionCard";
import { LiveBadge } from "@/components/LiveBadge";
import { useNow } from "@/hooks/useNow";

export default function LivePage() {
  const now = useNow(10_000);
  const live = sessions.filter((s) => isLive(s, now));

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-2">
        <LiveBadge size="md" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Sessions en direct</h1>
      </div>
      <p className="text-muted-foreground mb-8">Posez vos questions et upvotez en temps réel.</p>

      {live.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-10 text-center text-muted-foreground">
          Aucune session en direct pour l'instant.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {live.map((s) => <SessionCard key={s.id} session={s} />)}
        </div>
      )}
    </div>
  );
}