// src/components/ChatView.tsx
import React, { useState } from 'react';

// Define props for the component
interface ChatViewProps {
  onPromptSubmit: (prompt: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ onPromptSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPromptSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">My Chatbot</h1>
      {/* Your chat history would go here */}
      <div className="chat-history mb-4 h-96 overflow-y-auto">
        {/* Messages... */}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your prompt here..."
        />
      </form>
    </div>
  );
};

export default ChatView;