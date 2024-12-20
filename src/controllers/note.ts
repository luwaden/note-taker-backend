import express, { Request, Response, NextFunction } from "express";
import { INote } from "../utils/note.interface";
import Note from "../models/note.model";
import { create } from "domain";

export const notePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const { title, content } = req.body;
  if (!title || !content) {
    throw new Error("Title or content cannot be empty");
  }
  try {
    const note = await Note.create({ title, content });
    if (!note) {
      throw new Error("Invalid entry");
    }
    res.status(201).json({
      message: "Note successfully created",
      data: {
        _id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
      },
    });
  } catch (err) {
    throw new Error(`Error: ${err}`);
  }
};

export const noteGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notes = await Note.find();
    if (!notes) {
      throw new Error("No notes found");
    }
    res.status(200).json({
      message: "Notes rerieved successfully",
      data: notes,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error retrieving notes: ${err}`,
    });
  }
};

export const getOneNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteId = req.params.id;

  try {
    const notes = await Note.findById(noteId);
    if (!notes) {
      throw new Error("Note not found");
    }
    console.log(notes);

    res.status(200).json({
      message: "Note retrieved successfully",
      data: notes,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error retrieving note: ${err}`,
    });
  }
};

export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  try {
    const updateNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, updatedAt: Date.now },
      { new: true, runValidators: true }
    );
    console.log(updateNote);
    if (!updateNote) {
      throw new Error("Invalid entry");
    }
    res.status(200).json({
      message: "New Update to the note made succesfully",
      data: {
        title: updateNote?.title,
        content: updateNote?.content,
        updatedAt: updateNote?.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: `Error updating note${err}`,
    });
  }
};

export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteId = req.params.id;
  try {
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      throw new Error("Invalid entry");
    }

    res.status(200).json({
      message: "Note deleted successfully",
      data: deletedNote,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error deleting note:${err}`,
    });
  }
};
