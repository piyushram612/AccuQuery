import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
    <aside className="w-96 bg-white dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chat</h2>
        <span className="text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{role}</span>
      </div>
      
      <div className="flex-grow overflow-y-auto mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-400">Your chat history would appear here...</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a follow-up..."
          className="resize-none"
          rows={3}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </aside>
  );
};

export default ChatHistorySidebar;