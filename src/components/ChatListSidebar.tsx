import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChatSession } from '../types'; // Corrected Path
import { PlusSquare, MessageSquare } from 'lucide-react';

interface ChatListSidebarProps {
  chats: ChatSession[];
  onNewChat: () => void;
}

const ChatListSidebar: React.FC<ChatListSidebarProps> = ({ chats, onNewChat }) => {
  const { chatId } = useParams();

  return (
    <div className="w-80 bg-gray-50 border-r flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          <PlusSquare size={20} />
          New Chat
        </button>
      </div>
      <nav className="flex-grow p-2 overflow-y-auto">
        <h2 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Chats</h2>
        <ul className="space-y-1">
          {chats.map(chat => (
            <li key={chat.id}>
              <Link
                to={`/chat/${chat.id}`}
                className={`flex items-center gap-3 p-2 rounded-md text-sm transition-colors ${
                  chat.id === chatId ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="truncate">{chat.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ChatListSidebar;