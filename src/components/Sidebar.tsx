import React from 'react';
import { MessageSquare, FileText, BarChart3 } from 'lucide-react';

interface SidebarProps {
  activeView: 'chat' | 'audit' | 'analytics';
  onViewChange: (view: 'chat' | 'audit' | 'analytics') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    {
      id: 'chat' as const,
      label: 'Chat Interface',
      icon: MessageSquare,
      description: 'Query background data'
    },
    {
      id: 'audit' as const,
      label: 'Audit Log',
      icon: FileText,
      description: 'View query history'
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      icon: BarChart3,
      description: 'Data insights'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
          Navigation
        </h3>
        <nav className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeView === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Data Overview */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide mb-3">
          Data Overview
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Candidates</span>
            <span className="font-medium">20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Orders</span>
            <span className="font-medium">127</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Disputes</span>
            <span className="font-medium">8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;