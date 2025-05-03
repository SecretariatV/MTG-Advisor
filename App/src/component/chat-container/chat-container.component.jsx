import './chat-container.styles.css'
import {useState, useRef, useEffect} from "react"
import ChatInputBox from '../chat-inputbox/chat-inputbox.component'
import ChatMessageBox from '../chat-messagebox/chat-messagebox.component'
import axios from "axios"

const ChatContainer = ( {className}) => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Auto-scroll to bottom when messages update
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (inputText) => {
        if (!inputText.trim()) return;

        const updatedMessages = [...messages, { sender: 'user', text: inputText}];
        setMessages(updatedMessages);

        try{
            const res = await axios.post("http://localhost:5002/gemini", { message: inputText});
            setMessages([...updatedMessages, {sender: "bot", text: res.data.response}]);
        }
        catch (err){
            setMessages([...updatedMessages, {sender: "bot", text: "Error contacting Gemini server."}])
            console.log(err)
        }
    };

    return (
        <div className={`chat-container ${className}`}>
        <header className="chat-header">
            <h1>Insider Trading Advisor</h1>
        </header>
        <ChatMessageBox messages={messages} ref={messagesEndRef}/>
        <ChatInputBox onSend={handleSend} />
        </div>
    );
};

export default ChatContainer;