import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function ChatRoom({ identity }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("chatMessage");
  }, []);

  const sendMessage = () => {
    if (!message) return;
    const fullMsg = {
      user: `${identity.job}, ${identity.personality} (${identity.age})`,
      text: message,
    };
    socket.emit("chatMessage", fullMsg);
    setMessage("");
  };

  return (
    <div>
      <div className="border border-green-500 h-64 overflow-y-scroll mb-4 p-2">
        {messages.map((m, i) => (
          <div key={i} className="mb-1">
            <span className="font-bold">{m.user}: </span>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <input
        className="border border-green-500 p-2 w-3/4 bg-black text-green-400"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        className="ml-2 px-4 py-2 bg-green-500 text-black rounded"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}
export default ChatRoom;
