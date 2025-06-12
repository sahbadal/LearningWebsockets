import express from "express";
import Comment from "../models/Commet.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
});

router.post("/", async (req, res) => {
  const comment = await Comment.create(req.body);
  res.status(201).json(comment);
});

export default router;
