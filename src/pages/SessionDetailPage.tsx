"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowUp, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LiveBadge } from "@/components/LiveBadge";
import { getRoom, getSession, getSpeaker, isLive } from "@/lib/mockData";
import { useNow } from "@/hooks/useNow";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuestions } from "@/hooks/useQuestions";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

const qSchema = z.object({
  content: z.string().trim().min(3, "Question trop courte").max(500, "Max 500 caractères"),
  authorName: z.string().trim().max(60, "Nom trop long").optional(),
});

function fmt(d: string) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function SessionDetailPage() {
  const { sessionId = "" } = useParams();
  const session = getSession(sessionId);
  const now = useNow(15_000);
  const { isFavorite, toggle } = useFavorites();
  const { questions, add, upvote } = useQuestions(sessionId);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");

  if (!session) return <div className="p-10">Session introuvable.</div>;

  const live = isLive(session, now);
  const room = getRoom(session.roomId);
  const fav = isFavorite(session.id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = qSchema.safeParse({ content, authorName });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    add(sessionId, parsed.data.content, parsed.data.authorName);
    setContent("");
    toast.success("Question envoyée");
  };

  return (
    <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full">
      <Link href={`/events/${session.eventId}/planning`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Retour au planning
      </Link>

      <Card className={cn("mt-4 p-6 sm:p-8 bg-card/70 backdrop-blur border-border/60", live && "border-live/50 shadow-glow")}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {live && <LiveBadge size="md" />}
          {session.track && (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {session.track}
            </Badge>
          )}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{session.title}</h1>
        <p className="mt-3 text-muted-foreground">{session.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{fmt(session.startTime)} – {fmt(session.endTime)}</span>
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{room?.name}</span>
        </div>

        <div className="mt-6">
          <Button
            variant={fav ? "default" : "outline"}
            onClick={() => toggle(session.id)}
            className={cn(fav && "bg-gradient-primary text-primary-foreground border-0")}
          >
            <Star className={cn("h-4 w-4 mr-2", fav && "fill-current")} />
            {fav ? "Dans vos favoris" : "Ajouter aux favoris"}
          </Button>
        </div>
      </Card>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold mb-4">Intervenants</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {session.speakerIds.map((sid) => {
            const sp = getSpeaker(sid);
            if (!sp) return null;
            return (
              <Link href={`/speakers/${sp.id}`} key={sid}>
                <Card className="p-4 flex items-center gap-4 bg-card/60 border-border/60 hover:border-primary/50 transition-smooth">
                  <Image src={sp.photoUrl} alt={sp.fullName} width={56} height={56} className="h-14 w-14 rounded-full object-cover ring-2 ring-border" />
                  <div className="min-w-0">
                    <p className="font-display font-semibold">{sp.fullName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{sp.bio}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Questions & Réponses</h2>
          {live ? <LiveBadge /> : <span className="text-xs text-muted-foreground">Q&A disponible pendant la session</span>}
        </div>

        {live && (
          <Card className="p-5 bg-card/70 backdrop-blur border-border/60 mb-6">
            <form onSubmit={submit} className="space-y-3">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Posez votre question…"
                maxLength={500}
                rows={3}
                className="bg-background/50"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Votre nom (optionnel)"
                  maxLength={60}
                  className="bg-background/50 sm:max-w-xs"
                />
                <div className="flex items-center justify-between gap-3 flex-1">
                  <span className="text-xs text-muted-foreground">{content.length}/500</span>
                  <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">
                    Envoyer
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-3">
          {questions.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune question pour le moment.</p>
          )}
          {questions.map((q) => (
            <Card key={q.id} className="p-4 flex items-start gap-4 bg-card/60 border-border/60">
              <button
                onClick={() => live && upvote(q.id)}
                disabled={!live}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[52px] rounded-xl border border-border/60 px-2 py-2 transition-smooth",
                  live ? "hover:border-primary hover:text-primary-glow" : "opacity-60 cursor-not-allowed"
                )}
                aria-label="Upvote"
              >
                <ArrowUp className="h-4 w-4" />
                <span className="font-display font-semibold text-sm mt-0.5">{q.upvotes}</span>
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{q.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {q.authorName ?? "Anonyme"} · {new Date(q.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}