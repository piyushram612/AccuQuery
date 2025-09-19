import React from 'react';
import { MessageSquare, FileText, BarChart3 } from 'lucide-react';

interface SidebarProps {
  activeView: 'chat' | 'audit' | 'analytics';
  onViewChange: (view: 'chat' | 'audit' | 'analytics') => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, open, setOpen }) => {
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
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${open ? "w-64" : "w-16"}`}
        style={{ minWidth: open ? "16rem" : "4rem" }}
      >
        <div className={`h-full bg-white shadow-md flex flex-col ${open ? "p-4" : "items-center py-4"}`}>
          {/* Toggle Button */}
          <button
            className="mb-4 p-2 rounded-md bg-blue-600 text-white shadow-lg focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close sidebar" : "Open sidebar"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          {/* Navigation */}
          <h3 className={`text-sm font-medium text-gray-900 uppercase tracking-wide ${open ? "mb-6" : "hidden"}`}>
            Navigation
          </h3>
          <nav className={`flex-1 ${open ? "mt-6 space-y-2" : "flex flex-col gap-6 mt-2 items-center"}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={
                    open
                      ? `w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                          activeView === item.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      : `flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                          activeView === item.id
                            ? 'bg-blue-100 text-blue-600 border border-blue-200'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`
                  }
                  style={{ marginLeft: open ? undefined : 0 }}
                  title={item.label}
                >
                  <Icon className={`w-6 h-6 ${activeView === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  {open && (
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
          {/* Data Overview */}
          {open && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 mt-auto">
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
          )}
        </div>
      </div>
      {/* Overlay when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;