import { Router } from "express";
import { upvoteQuestion, deleteQuestion } from "../controllers/questionController.js";

const router = Router();

router.post("/:id/upvote", upvoteQuestion);
router.delete("/:id", deleteQuestion);

export default router;
