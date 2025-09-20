import { useState, useCallback } from 'react';
import { UserRole, CanvasWidget, CanvasLayout, Conversation, Message } from './types';
import { Button } from "@/components/ui/button";

// --- Import all your components ---
import Header from './components/Header';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import ChatInterface from './components/ChatInterface';
import AuditLog from './components/AuditLog';
import { Analytics } from './components/Analytics.mdx';
import PersistentCanvas from './components/PersistentCanvas';
import ComparisonModal from './components/ComparisonModal';

// --- Mock Functions (Replace with your actual logic) ---
const processNLPQuery = async (prompt: string, role: UserRole) => {
  console.log(`Processing query for ${role}: ${prompt}`);
  if (prompt.toLowerCase().includes('metric')) {
     return { type: 'metric', title: 'Total Orders', data: { value: '1,234' } };
  }
  return { type: 'text', title: `Response to: "${prompt}"`, data: { content: 'This is a detailed text response for your query.' } };
};
const calculateNextPosition = (widgets: CanvasWidget[]) => ({ x: 0, y: widgets.length * 10 });
const getDefaultSize = (type: CanvasWidget['type']) => {
  if (type === 'chart') return { width: 400, height: 300 };
  return { width: 300, height: 150 };
};
// --- End Mock Functions ---

function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Recruiter');
  const [activeView, setActiveView] = useState<'chat' | 'audit' | 'analytics'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Canvas and Widget State
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasWidgets, setCanvasWidgets] = useState<CanvasWidget[]>([]);

  // Comparison Modal State
  const [comparisonState, setComparisonState] = useState({
    isOpen: false,
    sourceWidgetId: null as string | null,
  });

  // Conversation State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

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
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };
  
  const handleCloseCanvas = () => {
    setIsCanvasOpen(false);
  };

  const handleWidgetCompare = (widgetId: string) => {
    setComparisonState({ isOpen: true, sourceWidgetId: widgetId });
  };

  const handleWidgetRemove = useCallback((widgetId: string) => {
    setCanvasWidgets(prev => prev.filter(w => w.id !== widgetId));
  }, []);

  const handleSendMessage = (newMessage: Message) => {
    if (!activeConversationId) return;

    // Update conversation with user message
    setConversations(prev => prev.map(c => 
      c.id === activeConversationId 
        ? { ...c, messages: [...c.messages, newMessage] } 
        : c
    ));

    // Process NLP and add assistant response and widget
    processNLPQuery(newMessage.content, selectedRole).then(response => {
      const assistantMessage: Message = { role: 'assistant', content: response.data.content };
      setConversations(prev => prev.map(c => 
        c.id === activeConversationId 
          ? { ...c, messages: [...c.messages, assistantMessage] } 
          : c
      ));

      const newWidget: CanvasWidget = {
        id: `widget_${Date.now()}`,
        type: response.type as CanvasWidget['type'],
        title: response.title,
        data: response.data,
        query: newMessage.content,
        timestamp: new Date().toISOString(),
        position: calculateNextPosition(canvasWidgets),
        size: getDefaultSize(response.type as CanvasWidget['type'])
      };
      setCanvasWidgets(prev => [...prev, newWidget]);
      setIsCanvasOpen(true);
    });
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
            messages={activeConversation.messages}
            onSendMessage={handleSendMessage} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
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

         {/* Main Content Area */}
         <main className="flex-1 flex flex-col overflow-y-auto">
            {renderActiveView()}
         </main>

         {/* Right Sidebar (Workspace) */}
         {isCanvasOpen && (
           <aside className="w-96 flex-shrink-0 border-l border-gray-200 dark:border-gray-800 flex flex-col">
              <header className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Workspace</h2>
                <Button
                  variant="outline"
                  onClick={handleCloseCanvas}
                >
                  Close
                </Button>
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