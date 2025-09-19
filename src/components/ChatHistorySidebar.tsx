import React, { useState } from 'react';
import { UserRole } from '../types';

interface ChatHistorySidebarProps {
  role: UserRole;
  onNewPrompt: (prompt: string) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ role, onNewPrompt }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onNewPrompt(prompt);
      setPrompt('');
    }
  };

  return (
    <aside className="w-96 bg-white p-4 border-r border-gray-200 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chat</h2>
        {/* FIX: Use the 'role' prop to clear the warning */}
        <span className="text-sm font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded">{role}</span>
      </div>
      
      <div className="flex-grow overflow-y-auto mb-4 p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Your chat history would appear here...</p>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded resize-none"
          placeholder="Ask a follow-up..."
          rows={3}
        />
        <button type="submit" className="w-full mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </aside>
  );
};

// FIX: Add this line to export the component
export default ChatHistorySidebar;