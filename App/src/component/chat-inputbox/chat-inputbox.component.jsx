import "./chat-inputbox.styles.css";
import { useState, useRef } from "react";

const ChatInputBox = ({ onSend }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const send = () => {
    if (input.trim()) {
      onSend(input);
      setInput(""); // Clear the input immediately
      adjustHeight(); // Reset height after clearing
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to calculate the new height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 125)}px`; // Cap height at 125px
    }
  };

  return (
    <div className="chat-input-box">
      <textarea
        ref={textareaRef}
        value={input}
        placeholder="Ask the Advisor..."
        onChange={(e) => {
          setInput(e.target.value);
          adjustHeight();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent default newline behavior
            send();
          }
        }}
        rows="1" // Initial height
      />
      <button onClick={send}>Send</button>
    </div>
  );
};

export default ChatInputBox;
