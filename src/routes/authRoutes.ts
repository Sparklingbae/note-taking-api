import express from "express";
import authenticateUser from "../middleware/authMiddleware";
import { getNotes, createNote } from "../controllers/noteController";

const router = express.Router();

router.get("/", authenticateUser, getNotes);
router.post("/", authenticateUser, createNote);

export default router;