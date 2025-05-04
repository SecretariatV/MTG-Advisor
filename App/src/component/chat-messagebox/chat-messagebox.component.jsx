import "./chat-messagebox.styles.css"
import {forwardRef} from "react"

const ChatMessageBox = forwardRef(({ messages }, ref) => {
    return (
      <div className="chat-message-box" ref={ref}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
           {msg.text}
          </div>
        ))}
      </div>
    );
  });

export default ChatMessageBox;
