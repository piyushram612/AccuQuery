import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatSession, Message } from '../types';
import { FiGrid } from 'react-icons/fi';

interface ChatInterfaceProps {
  chat: ChatSession;
  onPromptSubmit: (prompt: string, chatId: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chat, onPromptSubmit, isLoading }) => {
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    await onPromptSubmit(input, chat.id);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full p-4 bg-white">
      <div className="flex-1 overflow-y-auto mb-4 p-2">
        {chat.messages.map((msg: Message, idx: number) => (
          <div key={idx} className={`mb-3 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <span>{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</span>
            </div>
            {msg.role === 'assistant' && msg.hasWidget && (
              <button
                onClick={() => navigate(`/workspace/${chat.id}`)}
                className="mt-2 flex items-center gap-2 py-1 px-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-sm text-gray-700 font-semibold"
              >
                <FiGrid size={14} />
                Go to Workspace
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start my-2">
            <div className="max-w-xl p-3 rounded-lg bg-gray-100">
              <span className="animate-pulse text-gray-400">AccuQuery is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center gap-2 border-t pt-4">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Ask a question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={isLoading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
