// src/components/ChatInterface.tsx
import React, { useState } from 'react';
import { UserRole } from '../types';

// The props are simpler now
interface ChatInterfaceProps {
  role: UserRole;
  onPromptSubmit: (prompt: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ role, onPromptSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPromptSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    // This is now a full-screen component within the <main> tag
    <div className="p-6 flex flex-col h-full">
      <div className="flex-grow">{/* Chat history... */}</div>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-4 border rounded-lg shadow-sm"
          placeholder={`Ask anything as a ${role}...`}
        />
      </form>
    </div>
  );
};

export default ChatInterface;