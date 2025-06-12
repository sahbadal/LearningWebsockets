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

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
