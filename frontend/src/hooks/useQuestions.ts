import { useCallback, useEffect, useState } from "react";
import { questions as seed } from "@/lib/mockData";
import type { Question } from "@/lib/types";

const KEY = "eventflow:questions";

function read(): Question[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Question[];
  } catch {
    // Fall back to seed data when storage is unavailable or corrupted.
  }
  return seed;
}

let listeners: Array<() => void> = [];
const notify = () => listeners.forEach((l) => l());

export function useQuestions(sessionId?: string) {
  const [all, setAll] = useState<Question[]>([]);

  useEffect(() => {
    setAll(read());
    const sync = () => setAll(read());
    listeners.push(sync);
    return () => {
      listeners = listeners.filter((l) => l !== sync);
    };
  }, []);

  const persist = (next: Question[]) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    notify();
  };

  const add = useCallback((sId: string, content: string, authorName?: string) => {
    const next: Question = {
      id: `q_${Date.now()}`,
      sessionId: sId,
      content: content.trim().slice(0, 500),
      authorName: authorName?.trim() || undefined,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };
    persist([...read(), next]);
  }, []);

  const upvote = useCallback((qId: string) => {
    const next = read().map((q) => (q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q));
    persist(next);
  }, []);

  const list = sessionId
    ? all.filter((q) => q.sessionId === sessionId).sort((a, b) => b.upvotes - a.upvotes)
    : all;

  return { questions: list, add, upvote };
}