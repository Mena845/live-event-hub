import { useCallback, useEffect, useState } from "react";

const KEY = "eventflow:favorites";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setFavorites(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (next: string[]) => {
    setFavorites(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const toggle = useCallback((id: string) => {
    const next = read();
    const idx = next.indexOf(id);
    if (idx >= 0) next.splice(idx, 1);
    else next.push(id);
    persist(next);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
}