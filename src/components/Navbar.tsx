import React from 'react';
import { FiMessageSquare, FiClipboard, FiBarChart2 } from 'react-icons/fi';

type ViewName = 'chat' | 'audit' | 'analytics';

interface NavbarProps {
  activeView: ViewName;
  onViewChange: (view: ViewName) => void;
  isOpen: boolean;
}

const navItems = [
  { id: 'chat', label: 'Chat', icon: <FiMessageSquare size={24} /> },
  { id: 'audit', label: 'Audit Log', icon: <FiClipboard size={24} /> },
  { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 size={24} /> },
];

const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange, isOpen }) => {
  const navbarWidth = isOpen ? 'w-64' : 'w-20';

  return (
    <aside className={`${navbarWidth} bg-white dark:bg-gray-900 flex-shrink-0 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 flex flex-col`}>
      <nav className="p-4 mt-5">
        <ul>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <li key={item.id} className="mb-2 relative">
                <button
                  onClick={() => onViewChange(item.id as ViewName)}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200
                    ${!isOpen && 'justify-center'}
                    ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {/* The Color Bar Indicator */}
                  <div 
                    className={`absolute left-0 h-6 w-1 rounded-r-full transition-transform duration-300 ease-in-out ${isActive ? 'scale-y-100 bg-blue-600' : 'scale-y-0 bg-transparent'}`}
                  ></div>

                  {item.icon}
                  {isOpen && <span className="ml-4 font-semibold">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;