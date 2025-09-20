import React from 'react';
import { ChatSession } from '../types';
import { FiMessageSquare, FiClipboard, FiBarChart2, FiPlusSquare } from 'react-icons/fi';

type ViewName = 'chat' | 'audit' | 'analytics';

interface SidebarProps {
  activeView: ViewName;
  onViewChange: (view: ViewName) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  // New props for multi-chat
  chats: ChatSession[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, sidebarOpen, chats, activeChatId, onNewChat, onSelectChat }) => {
  const sidebarWidth = sidebarOpen ? 'w-64' : 'w-20';
  
  const navItems = [
    { id: 'chat', label: 'Chat', icon: <FiMessageSquare size={24} /> },
    { id: 'audit', label: 'Audit Log', icon: <FiClipboard size={24} /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 size={24} /> },
  ];

  return (
    <aside className={`${sidebarWidth} bg-white flex-shrink-0 transition-all duration-300 ease-in-out border-r flex flex-col`}>
      <nav className="p-4 mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => onViewChange(item.id as ViewName)}
                className={`w-full flex items-center p-3 rounded-lg text-left ${!sidebarOpen && 'justify-center'} ${activeView === item.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title={item.label}
              >
                {item.icon}
                {sidebarOpen && <span className="ml-4 font-semibold">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <hr className="mx-4" />

      {activeView === 'chat' && (
        <div className="flex-grow flex flex-col overflow-hidden">
            <div className="p-4">
                <button
                onClick={onNewChat}
                className={`w-full flex items-center p-2 rounded-lg text-left bg-gray-100 hover:bg-gray-200 ${!sidebarOpen && 'justify-center'}`}
                >
                    <FiPlusSquare size={20} className="text-gray-700" />
                    {sidebarOpen && <span className="ml-4 font-semibold text-sm text-gray-700">New Chat</span>}
                </button>
            </div>
            <nav className="flex-grow p-2 overflow-y-auto">
              <h2 className={`px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${!sidebarOpen && 'hidden'}`}>Recent Chats</h2>
              <ul className="space-y-1">
                {chats.map(chat => (
                  <li key={chat.id}>
                    <button
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-md text-sm transition-colors ${!sidebarOpen && 'justify-center'} ${chat.id === activeChatId ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-200'}`}
                      title={chat.title}
                    >
                      <FiMessageSquare size={16} className="flex-shrink-0" />
                      {sidebarOpen && <span className="truncate">{chat.title}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;