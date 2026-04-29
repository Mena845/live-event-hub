import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { sessions } from "@/lib/mockData";
import { SessionCard } from "@/components/SessionCard";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const favSessions = sessions.filter((s) => favorites.includes(s.id));

  return (
    <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-2">
        <Star className="h-6 w-6 text-primary-glow fill-current" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Mes favoris</h1>
      </div>
      <p className="text-muted-foreground mb-8">Stockés localement dans votre navigateur.</p>

      {favSessions.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-10 text-center">
          <p className="text-muted-foreground mb-4">Aucune session favorite pour l'instant.</p>
          <Button asChild className="bg-gradient-primary text-primary-foreground border-0">
            <Link to="/events/ev1/planning">Parcourir le planning</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favSessions.map((s) => <SessionCard key={s.id} session={s} />)}
        </div>
      )}
    </div>
  );
}