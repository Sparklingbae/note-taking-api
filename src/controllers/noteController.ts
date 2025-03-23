import { Request, Response } from "express";
import Note from '../models/note.model';

interface AuthRequest extends Request {
  user?: { userId: string };
}


export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user?.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;
    const newNote = new Note({ title, content, category, user: req.user?.userId });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};