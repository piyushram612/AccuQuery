// src/components/Sidebar.tsx
import React from 'react';
// Example using react-icons. You can use your own SVGs or icons.
import { FiMessageSquare, FiClipboard, FiBarChart2 } from 'react-icons/fi';

type ViewName = 'chat' | 'audit' | 'analytics';

interface SidebarProps {
  activeView: ViewName;
  onViewChange: (view: ViewName) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void; // This prop might be used by a button inside the sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, sidebarOpen }) => {
  // Use the prop to dynamically set the width
  const sidebarWidth = sidebarOpen ? 'w-64' : 'w-20';

  const navItems = [
    { id: 'chat', label: 'Chat', icon: <FiMessageSquare size={24} /> },
    { id: 'audit', label: 'Audit Log', icon: <FiClipboard size={24} /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 size={24} /> },
  ];

  return (
    <aside className={`${sidebarWidth} bg-white flex-shrink-0 transition-all duration-300 ease-in-out border-r`}>
      <nav className="p-4">
        <ul>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <li key={item.id} className="mb-2">
                <button
                  onClick={() => onViewChange(item.id as ViewName)}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    // Center icons when collapsed
                    !sidebarOpen && 'justify-center'
                  } ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {/* Only show the label if the sidebar is open */}
                  {sidebarOpen && <span className="ml-4 font-semibold">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;