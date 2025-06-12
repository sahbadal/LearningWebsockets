import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/comments", commentRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("newComment", (comment) => {
    socket.broadcast.emit("receiveComment", comment);
  });

  socket.on("deleteComment", (id) => {
    socket.broadcast.emit("commentDeleted", id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server is running on: http://localhost:${process.env.PORT}`)
);
