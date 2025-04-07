// src/components/ChatBox.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Load messages in real-time
  useEffect(() => {
    const q = query(
      collection(db, "chats", "global", "messages"),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!input.trim()) return;

    await addDoc(collection(db, "chats", "global", "messages"), {
      text: input,
      sender: user.uid,
      senderName: user.displayName,
      senderPhoto: user.photoURL,
      createdAt: serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <img
              src={msg.senderPhoto}
              alt=""
              style={{ width: "30px", borderRadius: "50%", marginRight: "10px" }}
            />
            <strong>{msg.senderName}</strong>
            <p style={{ margin: "5px 0" }}>{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px" }}>
          Send
        </button>
      </form>
    </div>
  );
}
