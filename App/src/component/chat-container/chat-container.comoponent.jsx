import './chat-container.styles.css'
import {useState} from "react"
import ChatInputBox from '../chat-inputbox/chat-inputbox.components.jsx'
import ChatMessageBox from '../chat-messagebox/chat-messagebox.components.jsx'
import axios from "axios"

const ChatContainer = ( {className}) => {
    const [message, setMessages] = useState([]);

    const handleSend = async (inputText) => {
        
    }

    return (
        <div className={className}>
            <p>this is chat container</p>
        </div>
    )
}

export default ChatContainer