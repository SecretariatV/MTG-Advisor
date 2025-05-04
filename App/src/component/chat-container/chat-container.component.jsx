import './chat-container.styles.css';
import { useState, useRef, useEffect } from 'react';
import ChatInputBox from '../chat-inputbox/chat-inputbox.component';
import ChatMessageBox from '../chat-messagebox/chat-messagebox.component';
import ChatLoading from '../chat-loading/chat-loading.component';
import axios from 'axios';

const ChatContainer = ({ className, insiderTrades, stockData }) => {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hey I am MTG Advisor, how can I help you?' }]);
  const [loading, setLoading] = useState(false); // Track loading state
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (inputText) => {
    if (!inputText.trim()) return;

    const updatedMessages = [...messages, { sender: 'user', text: inputText }];
    setMessages(updatedMessages);
    setLoading(true); // Set loading to true

    try {
      const res = await axios.post('http://localhost:5000/gemini', {
        message: inputText,
        insiderTrades: insiderTrades,
        stockData: stockData,
      });
      setMessages([...updatedMessages, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages([...updatedMessages, { sender: 'bot', text: 'Error contacting Gemini server.' }]);
      console.log(err);
    } finally {
      setLoading(false); // Set loading to false after response
    }
  };

  return (
    <div className={`chat-container ${className}`}>
      <header className="chat-header">
        <h1>MTG Advisor</h1>
      </header>
      <ChatMessageBox messages={messages} ref={messagesEndRef} />
      {loading && (
        <div className="loading">
          <ChatLoading /> {/* Use ChatLoading component for the loading animation */}
        </div>
      )}
      <ChatInputBox onSend={handleSend} />
    </div>
  );
};

export default ChatContainer;