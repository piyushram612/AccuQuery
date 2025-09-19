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
import Modal from './components/Modal'; // <-- Import the new Modal component

function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Recruiter');
  const [activeView, setActiveView] = useState<'chat' | 'audit' | 'analytics'>('chat');
  
  // We're back to using state to control the canvas visibility
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasData, setCanvasData] = useState<any>(null);

  const handlePromptSubmit = async (prompt: string) => {
    const responseData = {
      title: `Result for: "${prompt}"`,
      content: "This is the generated content inside the modal canvas.",
    };
    setCanvasData(responseData);
    setIsCanvasOpen(true); // This now opens the modal
  };

  const handleCloseCanvas = () => {
    setIsCanvasOpen(false); // This now closes the modal
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
      {/* The main application layout is ALWAYS rendered */}
      <Header selectedRole={selectedRole} onRoleChange={setSelectedRole} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-hidden">
          {renderDefaultView()}
        </main>
      </div>

      {/* The Modal is rendered here, on top of everything else, but is only visible when `isCanvasOpen` is true. */}
      <Modal isOpen={isCanvasOpen} onClose={handleCloseCanvas}>
        {/* This is the content that will appear inside the modal */}
        <div className="flex-1 flex overflow-hidden h-full">
            <ChatHistorySidebar role={selectedRole} onNewPrompt={handlePromptSubmit} />
            <Canvas data={canvasData} onClose={handleCloseCanvas} />
        </div>
      </Modal>
    </div>
  );
}

export default App;