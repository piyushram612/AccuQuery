import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

type ViewName = 'chat' | 'audit' | 'analytics';

interface SidebarProps {
  activeView: ViewName;
  onViewChange: (view: ViewName) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen }) => {
  const sidebarWidth = isOpen ? 'w-64' : 'w-20';
  const isActive = activeView === 'chat';

  return (
    <aside className={`${sidebarWidth} bg-white dark:bg-gray-900 flex-shrink-0 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 flex flex-col`}>
      <nav className="p-4 mt-5">
        <ul>
          <li className="mb-2 relative">
            <button
              onClick={() => onViewChange('chat')}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200
                ${!isOpen && 'justify-center'}
                ${
                  isActive
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              {/* The Color Bar Indicator */}
              <div 
                className={`absolute left-0 h-6 w-1 rounded-r-full transition-transform duration-300 ease-in-out ${isActive ? 'scale-y-100 bg-green-600' : 'scale-y-0 bg-transparent'}`}
              ></div>
              <FiMessageSquare size={24} />
              {isOpen && <span className="ml-4 font-semibold">Chat</span>}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;