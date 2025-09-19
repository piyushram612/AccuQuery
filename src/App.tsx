import React, { useState } from 'react';
import { UserRole } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AuditLog from './components/AuditLog';
import Analytics from './components/Analytics';

function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Recruiter');
  const [activeView, setActiveView] = useState<'chat' | 'audit' | 'analytics'>('chat');

  const renderMainContent = () => {
    switch (activeView) {
      case 'chat':
        return <ChatInterface role={selectedRole} />;
      case 'audit':
        return <AuditLog />;
      case 'analytics':
        return <Analytics />;
      default:
        return <ChatInterface role={selectedRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header selectedRole={selectedRole} onRoleChange={setSelectedRole} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;