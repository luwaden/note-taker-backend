import express, { Router, Request, Response, NextFunction } from "express";
import Note from "../models/note.model";
import {
  deleteNote,
  getOneNote,
  noteGet,
  notePost,
  updateNote,
} from "../controllers/note";
import authMiddleware from "../middleware/authorization.mw";
const router = Router();

router.post("/notes", notePost);

router.get("/notes", authMiddleware, noteGet);

router.get("/notes/:id", authMiddleware, getOneNote);

router.put("/notes/:id", updateNote);

router.delete("/notes/:id", deleteNote);

export default router;
