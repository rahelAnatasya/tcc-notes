import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note-controller.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();

router.get("/notes", verifyToken, getNotes);
router.get("/notes/:id", verifyToken, getNoteById);
router.post("/notes", verifyToken, createNote);
router.put("/notes/:id", verifyToken, updateNote);
router.delete("/notes/:id", verifyToken, deleteNote);

export default router;
