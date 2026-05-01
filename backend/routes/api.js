import express from "express";
import {
  events,
  sessions,
  speakers,
  rooms,
  questions,
  isLive,
  getEvent,
  getSession,
  getSpeaker,
} from "../data/mockData.js";

const router = express.Router();

router.get("/events", (req, res) => {
  res.json(events);
});

router.get("/events/:id", (req, res) => {
  const event = getEvent(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

router.get("/sessions", (req, res) => {
  res.json(sessions);
});

router.get("/sessions/:id", (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json(session);
});

router.get("/speakers", (req, res) => {
  res.json(speakers);
});

router.get("/speakers/:id", (req, res) => {
  const speaker = getSpeaker(req.params.id);
  if (!speaker) return res.status(404).json({ error: "Speaker not found" });
  res.json(speaker);
});

router.get("/rooms", (req, res) => {
  res.json(rooms);
});

router.get("/live", (req, res) => {
  res.json(sessions.filter((session) => isLive(session)));
});

router.get("/questions", (req, res) => {
  res.json(questions);
});

export default router;
