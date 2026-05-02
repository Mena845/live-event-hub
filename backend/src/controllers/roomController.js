import prisma from "../lib/prisma.js";

// GET /api/rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({ orderBy: { name: "asc" } });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des salles" });
  }
};

// GET /api/rooms/:id
export const getRoomById = async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
      include: { sessions: { orderBy: { startTime: "asc" } } },
    });
    if (!room) return res.status(404).json({ error: "Salle introuvable" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de la salle" });
  }
};

// POST /api/rooms
export const createRoom = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const room = await prisma.room.create({ data: { name, capacity } });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la salle" });
  }
};

// PUT /api/rooms/:id
export const updateRoom = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: { name, capacity },
    });
    res.json(room);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Salle introuvable" });
    res.status(500).json({ error: "Erreur lors de la mise à jour de la salle" });
  }
};

// DELETE /api/rooms/:id
export const deleteRoom = async (req, res) => {
  try {
    await prisma.room.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Salle introuvable" });
    res.status(500).json({ error: "Erreur lors de la suppression de la salle" });
  }
};
