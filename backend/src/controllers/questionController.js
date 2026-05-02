import prisma from "../lib/prisma.js";

// GET /api/sessions/:sessionId/questions
export const getQuestionsBySession = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      where: { sessionId: req.params.sessionId },
      orderBy: { upvotes: "desc" },
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des questions" });
  }
};

// POST /api/sessions/:sessionId/questions
export const createQuestion = async (req, res) => {
  try {
    const { content, authorName } = req.body;
    const question = await prisma.question.create({
      data: { sessionId: req.params.sessionId, content, authorName },
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la question" });
  }
};

// POST /api/questions/:id/upvote
export const upvoteQuestion = async (req, res) => {
  try {
    const question = await prisma.question.update({
      where: { id: req.params.id },
      data: { upvotes: { increment: 1 } },
    });
    res.json(question);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Question introuvable" });
    res.status(500).json({ error: "Erreur lors de l'upvote" });
  }
};

// DELETE /api/questions/:id
export const deleteQuestion = async (req, res) => {
  try {
    await prisma.question.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Question introuvable" });
    res.status(500).json({ error: "Erreur lors de la suppression de la question" });
  }
};
