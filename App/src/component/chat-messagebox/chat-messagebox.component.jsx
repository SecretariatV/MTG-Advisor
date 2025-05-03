import "./chat-messagebox.styles.css"
import {useState} from "react"

const ChatMessageBox = ({ messages }) => {
    return (
      <div className="chat-message-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            <strong>{msg.sender === "user" ? "You" : "Advisor"}:</strong> {msg.text}
          </div>
        ))}
      </div>
    );
  };

export default ChatMessageBox;
