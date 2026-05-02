import prisma from "../lib/prisma.js";

// GET /api/favorites?userToken=xxx
export const getFavorites = async (req, res) => {
  try {
    const { userToken } = req.query;
    if (!userToken) return res.status(400).json({ error: "userToken requis" });

    const favorites = await prisma.favorite.findMany({
      where: { userToken },
      include: {
        session: {
          include: {
            room: true,
            event: { select: { id: true, title: true } },
            speakers: { include: { speaker: true }, orderBy: { sortOrder: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des favoris" });
  }
};

// POST /api/favorites
export const addFavorite = async (req, res) => {
  try {
    const { userToken, sessionId } = req.body;
    if (!userToken || !sessionId) return res.status(400).json({ error: "userToken et sessionId requis" });

    const favorite = await prisma.favorite.create({
      data: { userToken, sessionId },
    });
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ error: "Session déjà en favoris" });
    res.status(500).json({ error: "Erreur lors de l'ajout en favori" });
  }
};

// DELETE /api/favorites
export const removeFavorite = async (req, res) => {
  try {
    const { userToken, sessionId } = req.body;
    if (!userToken || !sessionId) return res.status(400).json({ error: "userToken et sessionId requis" });

    await prisma.favorite.delete({
      where: { userToken_sessionId: { userToken, sessionId } },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Favori introuvable" });
    res.status(500).json({ error: "Erreur lors de la suppression du favori" });
  }
};
