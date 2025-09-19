import React, { useState } from 'react';
import { UserRole } from './types';

// Import all your components, including the new Modal
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AuditLog from './components/AuditLog';
import Analytics from './components/Analytics';
import Canvas from './components/Canvas';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import Modal from './components/Modal';

function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Recruiter');
  const [activeView, setActiveView] = useState<'chat' | 'audit' | 'analytics'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasData, setCanvasData] = useState<any>(null);

  const handlePromptSubmit = async (prompt: string) => {
    const responseData = {
      title: `Result for: "${prompt}"`,
      content: "This is the generated content inside the modal canvas.",
    };
    setCanvasData(responseData);
    setIsCanvasOpen(true);
  };

  const handleCloseCanvas = () => {
    setIsCanvasOpen(false);
    setCanvasData(null);
  };

  const renderDefaultView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatInterface role={selectedRole} onPromptSubmit={handlePromptSubmit} />;
      case 'audit':
        return <AuditLog />;
      case 'analytics':
        return <Analytics />;
      default:
        return <ChatInterface role={selectedRole} onPromptSubmit={handlePromptSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header selectedRole={selectedRole} onRoleChange={setSelectedRole} sidebarOpen={sidebarOpen} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className={`flex-1 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}> 
          {renderDefaultView()}
        </main>
      </div>
      {/* Modal Canvas */}
      <Modal isOpen={isCanvasOpen} onClose={handleCloseCanvas}>
        <div className="flex-1 flex overflow-hidden h-full">
          <ChatHistorySidebar role={selectedRole} onNewPrompt={handlePromptSubmit} />
          <Canvas data={canvasData} onClose={handleCloseCanvas} />
        </div>
      </Modal>
    </div>
  );
}

export default App;