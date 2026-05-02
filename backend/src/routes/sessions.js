import { Router } from "express";
import {
  getAllSessions,
  getLiveSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";
import { getQuestionsBySession, createQuestion } from "../controllers/questionController.js";

const router = Router();

router.get("/", getAllSessions);
router.get("/live", getLiveSessions);         // ⚠️ avant /:id
router.get("/:id", getSessionById);
router.post("/", createSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

// Questions imbriquées sous une session
router.get("/:sessionId/questions", getQuestionsBySession);
router.post("/:sessionId/questions", createQuestion);

export default router;
