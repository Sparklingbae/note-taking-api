import express, { Request, Response, NextFunction } from 'express';
import Note from '../models/note.model';
import { validateNote } from '../middleware/validateNote';
import { getNotes, createNote } from '../controllers/noteController';
import  authenticateUser  from '../middleware/authMiddleware';

const router = express.Router();

router.get("/", authenticateUser, getNotes);
router.post("/", authenticateUser, createNote);

router.get("/categories/:categoryId", async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const notes = await Note.find({ categoryId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notes by category" });
  }
});


router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: 'Title and content are required' });
      return;
    }

    const newNote = new Note({ title, content });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    next(error);
  }
});

router.post("/", validateNote, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, categoryId } = req.body;

    const newNote = new Note({ title, content, categoryId });
    await newNote.save();

    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Failed to create note", details: err.message });
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, categoryId } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, categoryId, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
     res.status(404).json({ error: "Note not found" });
     return;
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Error updating note" });
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;