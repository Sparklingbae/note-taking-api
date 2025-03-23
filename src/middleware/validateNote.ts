import { Request, Response, NextFunction } from "express";
import { Note } from "../types";

export const validateNote = (req: Request, res: Response, next: NextFunction): void => {
  const { title, content, categoryId }: Partial<Note> = req.body;

  if (!title || !content || !categoryId) {
    res.status(400).json({ error: "Missing required fields" });
    return; 
  }

  next(); 
};