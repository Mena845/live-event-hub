"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Linkedin, Twitter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { sessions, speakers } from "@/lib/mockData";
import { SessionCard } from "@/components/SessionCard";
import { useQuestions } from "@/hooks/useQuestions";

export default function SpeakerDetailPage() {
  const params = useParams();
  const rawSpeakerId = params?.speakerId;
  const speakerId = typeof rawSpeakerId === "string" ? rawSpeakerId : Array.isArray(rawSpeakerId) ? rawSpeakerId[0] : "";
  const sp = speakers.find((s) => s.id === speakerId);
  const { questions } = useQuestions();

  if (!sp) return <div className="p-10">Intervenant introuvable.</div>;

  const spSessions = sessions.filter((s) => s.speakerIds.includes(sp.id));
  const sessionIds = new Set(spSessions.map((s) => s.id));
  const spQuestions = questions
    .filter((q) => sessionIds.has(q.sessionId))
    .sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full">
<Link href="/speakers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tous les intervenants
      </Link>

      <Card className="mt-4 p-6 sm:p-8 bg-card/70 backdrop-blur border-border/60 shadow-elegant">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Image
            src={sp.photoUrl}
            alt={sp.fullName}
            width={112}
            height={112}
            className="h-28 w-28 rounded-2xl object-cover ring-2 ring-border"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-bold tracking-tight">{sp.fullName}</h1>
            <p className="mt-3 text-muted-foreground">{sp.bio}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {sp.links.twitter && (
                <a href={sp.links.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-glow hover:underline">
                  <Twitter className="h-4 w-4" /> Twitter
                </a>
              )}
              {sp.links.linkedin && (
                <a href={sp.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-glow hover:underline">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {sp.links.website && (
                <a href={sp.links.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-glow hover:underline">
                  <ExternalLink className="h-4 w-4" /> Site web
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold mb-4">Sessions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {spSessions.map((s) => <SessionCard key={s.id} session={s} />)}
        </div>
      </section>

      {spQuestions.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-4">Questions reçues</h2>
          <div className="space-y-3">
            {spQuestions.map((q) => (
              <Card key={q.id} className="p-4 bg-card/60 border-border/60">
                <p className="text-sm">{q.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {q.authorName ?? "Anonyme"} · {q.upvotes} upvote{q.upvotes > 1 ? "s" : ""}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}