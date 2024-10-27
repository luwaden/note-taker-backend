import express, { Router, Request, Response, NextFunction } from "express";
import Note from "../models/note.model";
import {
  deleteNote,
  getOneNote,
  noteGet,
  notePost,
  updateNote,
} from "../controllers/note";
const router = Router();

router.post("/notes", notePost);

router.get("/notes", noteGet);

router.get("/notes/:id", getOneNote);

router.put("/notes/:id", updateNote);

router.delete("/notes/:id", deleteNote);

export default router;
