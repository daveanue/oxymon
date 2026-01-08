import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';

interface ChatPanelProps {
    onCollapse: () => void;
}

export function ChatPanel({ onCollapse }: ChatPanelProps) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, addMessage, isListening, setListening } = useAppStore();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        addMessage('user', userMessage);
        setIsLoading(true);

        try {
            const result = await window.electronAPI.chat.sendMessage(userMessage);
            if (result.success) {
                addMessage('assistant', result.response);
            }
        } catch (error) {
            addMessage('assistant', 'Sorry, something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVoice = () => {
        if (isListening) {
            window.electronAPI.voice.stopListening();
            setListening(false);
        } else {
            window.electronAPI.voice.startListening();
            setListening(true);
        }
    };

    return (
        <motion.div
            className="chat-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
            {/* Header */}
            <div className="chat-header">
                <h1 className="chat-title">Voice Assistant</h1>
                <div className="chat-header-actions">
                    <button
                        className="header-btn"
                        onClick={toggleVoice}
                        title={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        {isListening ? '🎤' : '🎙️'}
                    </button>
                    <button
                        className="header-btn"
                        onClick={onCollapse}
                        title="Collapse"
                    >
                        ⬇️
                    </button>
                    <button
                        className="header-btn"
                        onClick={() => window.electronAPI.window.close()}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <p>👋 Hi! How can I help you today?</p>
                        <p className="chat-empty-hint">
                            Type a message or click the mic to speak
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <motion.div
                            key={message.id}
                            className={`chat-message ${message.role}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="message-content">{message.content}</div>
                        </motion.div>
                    ))
                )}
                {isLoading && (
                    <div className="chat-message assistant">
                        <div className="message-content typing">
                            <span>•</span>
                            <span>•</span>
                            <span>•</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()}>
                    Send
                </button>
            </form>
        </motion.div>
    );
}
