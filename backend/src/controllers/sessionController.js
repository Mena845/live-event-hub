import prisma from "../lib/prisma.js";

// GET /api/sessions  (optionnel: ?eventId=xxx&track=xxx)
export const getAllSessions = async (req, res) => {
  try {
    const { eventId, track } = req.query;
    const sessions = await prisma.session.findMany({
      where: {
        ...(eventId && { eventId }),
        ...(track && { track }),
      },
      include: {
        room: true,
        speakers: { include: { speaker: true }, orderBy: { sortOrder: "asc" } },
        event: { select: { id: true, title: true } },
      },
      orderBy: { startTime: "asc" },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des sessions" });
  }
};

// GET /api/sessions/live
export const getLiveSessions = async (req, res) => {
  try {
    const now = new Date();
    const sessions = await prisma.session.findMany({
      where: {
        startTime: { lte: now },
        endTime: { gte: now },
      },
      include: {
        room: true,
        speakers: { include: { speaker: true }, orderBy: { sortOrder: "asc" } },
        event: { select: { id: true, title: true } },
      },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des sessions en direct" });
  }
};

// GET /api/sessions/:id
export const getSessionById = async (req, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: {
        room: true,
        event: true,
        speakers: { include: { speaker: true }, orderBy: { sortOrder: "asc" } },
        questions: { orderBy: { upvotes: "desc" } },
      },
    });
    if (!session) return res.status(404).json({ error: "Session introuvable" });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de la session" });
  }
};

// POST /api/sessions
export const createSession = async (req, res) => {
  try {
    const { eventId, roomId, title, description, track, startTime, endTime, capacity, speakerIds } = req.body;
    const session = await prisma.session.create({
      data: {
        eventId,
        roomId,
        title,
        description,
        track,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity,
        ...(speakerIds?.length && {
          speakers: {
            create: speakerIds.map((speakerId, index) => ({ speakerId, sortOrder: index })),
          },
        }),
      },
      include: { room: true, speakers: { include: { speaker: true } } },
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la session" });
  }
};

// PUT /api/sessions/:id
export const updateSession = async (req, res) => {
  try {
    const { roomId, title, description, track, startTime, endTime, capacity } = req.body;
    const session = await prisma.session.update({
      where: { id: req.params.id },
      data: {
        roomId,
        title,
        description,
        track,
        capacity,
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
      },
      include: { room: true, speakers: { include: { speaker: true } } },
    });
    res.json(session);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Session introuvable" });
    res.status(500).json({ error: "Erreur lors de la mise à jour de la session" });
  }
};

// DELETE /api/sessions/:id
export const deleteSession = async (req, res) => {
  try {
    await prisma.session.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Session introuvable" });
    res.status(500).json({ error: "Erreur lors de la suppression de la session" });
  }
};
