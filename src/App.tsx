import { useState, useCallback } from 'react';
import { UserRole, CanvasWidget, Conversation, Message } from './types';
import { Button } from "@/components/ui/button";

// --- Import all your components ---
import Header from './components/Header';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import ChatInterface from './components/ChatInterface';
import AuditLog from './components/AuditLog';
import { Analytics } from './components/Analytics.mdx';
import PersistentCanvas from './components/PersistentCanvas';
import ComparisonModal from './components/ComparisonModal';

// --- Initial State Setup ---
const initialConversation: Conversation = {
  id: `conv_${Date.now()}`,
  title: 'New Chat',
  messages: [{ role: 'assistant', content: "How can I help you analyze the background check data today?" }],
};

function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Recruiter');
  const [activeView, setActiveView] = useState<'chat' | 'audit' | 'analytics'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasWidgets, setCanvasWidgets] = useState<CanvasWidget[]>([]);

  const [comparisonState, setComparisonState] = useState({
    isOpen: false,
    sourceWidgetId: null as string | null,
  });

  const [conversations, setConversations] = useState<Conversation[]>([initialConversation]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversation.id);

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'New Chat',
      messages: [{ role: 'assistant', content: "How can I help you analyze the background check data today?" }],
    };
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newConversation.id);
    setActiveView('chat');
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setActiveView('chat');
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => {
        const remaining = prev.filter(c => c.id !== id);
        if (activeConversationId === id) {
            setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
        }
        return remaining;
    });
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };
  
  const handleCloseCanvas = () => setIsCanvasOpen(false);
  
  const handleGoToWorkspace = () => setIsCanvasOpen(true);

  const handleWidgetCompare = (widgetId: string) => {
    setComparisonState({ isOpen: true, sourceWidgetId: widgetId });
  };

  const handleWidgetRemove = useCallback((widgetId: string) => {
    setCanvasWidgets(prev => prev.filter(w => w.id !== widgetId));
  }, []);

  const handleChatReply = (reply: unknown, prompt: string) => {
    const newWidget: CanvasWidget = {
      id: `widget_${Date.now()}`,
      type: (Array.isArray(reply) && reply.length > 0 && typeof reply[0] === 'object') ? 'table' : 'text',
      title: `Response to: "${prompt}"`,
      data: reply,
      query: prompt,
      timestamp: new Date().toISOString(),
      position: { x: 0, y: 0 },
      size: { width: 300, height: 150 }
    };
    setCanvasWidgets(prev => [...prev, newWidget]);
    setIsCanvasOpen(true);
  };
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const renderActiveView = () => {
     switch (activeView) {
      case 'audit':
        return <AuditLog />;
      case 'analytics':
        return <Analytics />;
      case 'chat':
      default:
        return activeConversation ? (
          <ChatInterface 
            key={activeConversation.id} // Ensures component re-mounts on conversation change
            initialMessages={activeConversation.messages}
            onReply={handleChatReply} 
            onGoToWorkspace={handleGoToWorkspace}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <div>
              <h2 className="text-2xl font-semibold">Welcome to AccuQuery AI</h2>
              <p>Start a new conversation or select one to begin.</p>
            </div>
          </div>
        );
    }
  }

  return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
       <Header 
         selectedRole={selectedRole} 
         onRoleChange={setSelectedRole}
         activeView={activeView}
         onViewChange={setActiveView}
         onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
       />
       <div className="flex-1 flex overflow-hidden">
         <ChatHistorySidebar 
            isOpen={sidebarOpen}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNewConversation={handleNewConversation}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
         />
         <main className="flex-1 flex flex-col overflow-y-auto">
            {renderActiveView()}
         </main>
         {isCanvasOpen && (
           <aside className="w-[450px] flex-shrink-0 border-l border-gray-200 dark:border-gray-800 flex flex-col">
              <header className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Workspace</h2>
                <Button variant="outline" onClick={handleCloseCanvas}>Close</Button>
              </header>
              <PersistentCanvas
                widgets={canvasWidgets}
                onWidgetRemove={handleWidgetRemove}
                onWidgetCompare={handleWidgetCompare}
              />
           </aside>
         )}
       </div>
      <ComparisonModal
        isOpen={comparisonState.isOpen}
        onClose={() => setComparisonState({ isOpen: false, sourceWidgetId: null })}
        onSubmit={() => {}}
      />
    </div>
  );
}

export default App;