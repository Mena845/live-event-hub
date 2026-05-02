import crypto from "crypto";
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
  getRoom,
} from "../data/mockData.js";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";
const adminTokens = new Set();

const createAdminToken = () => {
  const token = crypto.randomBytes(24).toString("hex");
  adminTokens.add(token);
  return token;
};

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Admin authentication required" });
  }

  const token = authHeader.slice(7);
  if (!adminTokens.has(token)) {
    return res.status(401).json({ error: "Invalid admin token" });
  }

  next();
};

const buildSession = (session) => ({
  ...session,
  room: getRoom(session.roomId),
  speakers: session.speakerIds?.map((speakerId, index) => {
    const speaker = getSpeaker(speakerId);
    return speaker ? { sortOrder: index, speaker } : null;
  }).filter(Boolean),
});

const buildEvent = (event) => ({
  ...event,
  sessions: sessions.filter((session) => session.eventId === event.id).map(buildSession),
});

const buildSpeakerDetail = (speaker) => ({
  ...speaker,
  sessions: sessions
    .filter((session) => session.speakerIds?.includes(speaker.id))
    .map((session, index) => ({ sortOrder: index, session: buildSession(session) })),
});

const buildSessionResponse = (session) => buildSession(session);

const findSpeakerById = (id) => speakers.find((speaker) => speaker.id === id);
const findEventById = (id) => events.find((event) => event.id === id);

const createSessionObject = ({ eventId, roomId, title, description, track, startTime, endTime, capacity, speakerIds }) => {
  return {
    id: `s${sessions.length + 1}`,
    eventId,
    roomId,
    title,
    description,
    track,
    startTime,
    endTime,
    capacity,
    speakerIds: Array.isArray(speakerIds) ? speakerIds : [],
  };
};

const createSpeakerObject = ({ fullName, photoUrl, bio, twitter, linkedin, website }) => ({
  id: `sp${speakers.length + 1}`,
  fullName,
  photoUrl,
  bio,
  links: {
    twitter: twitter || null,
    linkedin: linkedin || null,
    website: website || null,
  },
});

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
  const eventId = req.query.eventId;
  const results = eventId ? sessions.filter((session) => session.eventId === eventId) : sessions;
  res.json(results.map((session) => ({
    ...session,
    room: getRoom(session.roomId),
    speakers: session.speakerIds?.map((speakerId, index) => ({
      sortOrder: index,
      speaker: getSpeaker(speakerId),
    })) ?? [],
  })));
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
  res.json(sessions.filter((session) => isLive(session)).map((session) => ({
    ...session,
    room: getRoom(session.roomId),
    speakers: session.speakerIds?.map((speakerId, index) => ({
      sortOrder: index,
      speaker: getSpeaker(speakerId),
    })) ?? [],
  })));
});

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  const token = createAdminToken();
  res.json({ token });
});

router.post("/sessions", requireAdmin, (req, res) => {
  const { eventId, roomId, title, description, track, startTime, endTime, capacity, speakerIds } = req.body;
  if (!eventId || !title || !startTime || !endTime) {
    return res.status(400).json({ error: "eventId, title, startTime and endTime are required" });
  }
  if (!findEventById(eventId)) {
    return res.status(400).json({ error: "Event introuvable" });
  }

  const session = createSessionObject({
    eventId,
    roomId: roomId || null,
    title,
    description,
    track,
    startTime,
    endTime,
    capacity: capacity ? Number(capacity) : undefined,
    speakerIds: Array.isArray(speakerIds) ? speakerIds : [],
  });

  sessions.push(session);
  res.status(201).json(buildSessionResponse(session));
});

router.put("/sessions/:id", requireAdmin, (req, res) => {
  const { roomId, title, description, track, startTime, endTime, capacity, speakerIds } = req.body;
  const index = sessions.findIndex((session) => session.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Session introuvable" });

  const current = sessions[index];
  const updated = {
    ...current,
    roomId: roomId === undefined ? current.roomId : roomId,
    title: title ?? current.title,
    description: description ?? current.description,
    track: track ?? current.track,
    startTime: startTime ?? current.startTime,
    endTime: endTime ?? current.endTime,
    capacity: capacity !== undefined ? Number(capacity) : current.capacity,
    speakerIds: Array.isArray(speakerIds) ? speakerIds : current.speakerIds,
  };

  sessions[index] = updated;
  res.json(buildSessionResponse(updated));
});

router.delete("/sessions/:id", requireAdmin, (req, res) => {
  const index = sessions.findIndex((session) => session.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Session introuvable" });
  sessions.splice(index, 1);
  res.status(204).send();
});

router.post("/speakers", requireAdmin, (req, res) => {
  const { fullName, photoUrl, bio, twitter, linkedin, website } = req.body;
  if (!fullName) return res.status(400).json({ error: "fullName is required" });

  const speaker = createSpeakerObject({ fullName, photoUrl, bio, twitter, linkedin, website });
  speakers.push(speaker);
  res.status(201).json(speaker);
});

router.put("/speakers/:id", requireAdmin, (req, res) => {
  const { fullName, photoUrl, bio, twitter, linkedin, website } = req.body;
  const index = speakers.findIndex((speaker) => speaker.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Speaker introuvable" });

  speakers[index] = {
    ...speakers[index],
    fullName: fullName ?? speakers[index].fullName,
    photoUrl: photoUrl ?? speakers[index].photoUrl,
    bio: bio ?? speakers[index].bio,
    links: {
      twitter: twitter ?? speakers[index].links?.twitter ?? null,
      linkedin: linkedin ?? speakers[index].links?.linkedin ?? null,
      website: website ?? speakers[index].links?.website ?? null,
    },
  };

  res.json(speakers[index]);
});

router.delete("/speakers/:id", requireAdmin, (req, res) => {
  const index = speakers.findIndex((speaker) => speaker.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Speaker introuvable" });
  speakers.splice(index, 1);
  sessions.forEach((session) => {
    session.speakerIds = session.speakerIds?.filter((id) => id !== req.params.id);
  });
  res.status(204).send();
});

router.get("/sessions/:sessionId/questions", (req, res) => {
  const sessionQuestions = questions
    .filter((question) => question.sessionId === req.params.sessionId)
    .sort((a, b) => b.upvotes - a.upvotes);
  res.json(sessionQuestions);
});

router.post("/sessions/:sessionId/questions", (req, res) => {
  const { content, authorName } = req.body;
  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Content is required" });
  }

  const nextId = `q${questions.length + 1}`;
  const question = {
    id: nextId,
    sessionId: req.params.sessionId,
    content: content.trim(),
    authorName: authorName?.trim() || null,
    upvotes: 0,
    createdAt: new Date().toISOString(),
  };

  questions.push(question);
  res.status(201).json(question);
});

router.post("/questions/:id/upvote", (req, res) => {
  const question = questions.find((q) => q.id === req.params.id);
  if (!question) return res.status(404).json({ error: "Question not found" });
  question.upvotes += 1;
  res.json(question);
});

router.get("/questions", (req, res) => {
  res.json(questions);
});

export default router;
