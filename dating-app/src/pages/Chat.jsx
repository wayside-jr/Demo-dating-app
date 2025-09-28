import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./Chat.css";

export default function Chat({ token }) {
  const { id: receiverId } = useParams();
  const location = useLocation();
  const receiverUsername = location.state?.username || "User";
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();
  const userId = parseInt(localStorage.getItem("userId"));
  const roomId = [userId, receiverId].sort().join("_");

  // Connect to Socket.IO
  useEffect(() => {
    if (!userId || !token) return;

    socketRef.current = io("http://127.0.0.1:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO:", socketRef.current.id);
      socketRef.current.emit("join", { room: roomId });
    });

    socketRef.current.on("receive_message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => socketRef.current.disconnect();
  }, [roomId, token, userId]);

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [receiverId, token]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      sender_id: userId,
      receiver_id: parseInt(receiverId),
      content: newMessage,
      room: roomId,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: receiverId, content: tempMessage.content }),
      });
      const saved = await res.json();
      const messageWithId = { ...saved.message, room: roomId };
      socketRef.current.emit("send_message", messageWithId);

      // Replace temporary message
      setMessages((prev) =>
        prev.map((m) => (m.timestamp === tempMessage.timestamp ? messageWithId : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat with {receiverUsername}</h2>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id || msg.timestamp} className={`message ${msg.sender_id === userId ? "sent" : "received"}`}>
            <p>{msg.content}</p>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
