import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./socket";

function App() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = prompt("Enter your name:");
    setUsername(user || "Anonymous");

    axios.get("http://localhost:5000/api/comments")
      .then(res => setComments(res.data));

    socket.on("receiveComment", (comment) => {
      setComments(prev => [comment, ...prev]);
    });

    socket.on("commentDeleted", (id) => {
      setComments(prev => prev.filter(c => c._id !== id));
    });

    return () => {
      socket.off("receiveComment");
      socket.off("commentDeleted");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    const newComment = {
      username,
      content: input,
      createdAt: new Date().toISOString()
    };

    const res = await axios.post("http://localhost:5000/api/comments", newComment);
    setComments(prev => [res.data, ...prev]);
    socket.emit("newComment", res.data);
    setInput("");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`);
      setComments(prev => prev.filter(c => c._id !== id));
      socket.emit("deleteComment", id);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-800">🚀 Introduction to Node.js</h1>
          <p className="mt-2 text-gray-700">
            Node.js is a powerful JavaScript runtime built on Chrome's V8 engine. It allows developers to write scalable backend applications using JavaScript.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition duration-300"
          >
            Post
          </button>
        </form>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {comments.map((c) => (
            <div key={c._id} className="group bg-indigo-50 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-indigo-800">{c.username}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{formatTime(c.createdAt)}</span>
                  {c.username === username && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="ml-2 p-1 rounded-full hover:bg-red-100 transition group/delete"
                      title="Delete comment"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-600 group-hover/delete:text-red-800 transition"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 3v1H4v2h16V4h-5V3H9zm-1 5v11h2V8H8zm4 0v11h2V8h-2zm4 0v11h2V8h-2z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 mt-1">{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
