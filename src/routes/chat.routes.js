import { Router } from "express";
import { chat } from "../controllers/chat.controller.js";

const router = Router();

// POST /api/chat
router.post("/", chat);

export default router;
