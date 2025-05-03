import "./chat-messagebox.styles.css"
import {useState} from "react"
import {forwardRef} from "react"

const ChatMessageBox = forwardRef(({ messages }, ref) => {
    return (
      <div className="chat-message-box" ref={ref}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            <strong>{msg.sender === "user" ? "You" : "Advisor"}:</strong> {msg.text}
          </div>
        ))}
      </div>
    );
  });

export default ChatMessageBox;
