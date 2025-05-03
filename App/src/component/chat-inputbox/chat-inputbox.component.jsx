import "./chat-inputbox.styles.css"
import {useState} from "react"

const ChatInputBox = ({ onSend }) => {
    const [input, setInput] = useState("");
  
    const send = () => {
      if (input.trim()) {
        onSend(input);
        setInput("");
      }
    };
  
    return (
      <div className="chat-input-box">
        <input
          type="text"
          value={input}
          placeholder="Ask the Advisor..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send}>Send</button>
      </div>
    );
  };
export default ChatInputBox;
