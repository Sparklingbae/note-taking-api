import express, { Request, Response, NextFunction } from 'express';
import Note from '../models/note.model'; 

const router = express.Router();


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