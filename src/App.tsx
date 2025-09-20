import { useState, useCallback } from 'react';
import Login from './components/Login';
import { UserRole, CanvasWidget, Conversation, Folder } from './types';
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
const initialFolderId = `folder_${Date.now()}`;
const initialConversationId = `conv_${Date.now()}`;

const initialFolders: Folder[] = [
    { id: initialFolderId, name: 'Work' },
    { id: `folder_${Date.now() + 1}`, name: 'Projects' },
    { id: `folder_${Date.now() + 2}`, name: 'Clients' },
];

const initialConversation: Conversation = {
  id: initialConversationId,
  title: 'New Chat',
  messages: [{ role: 'assistant', content: "How can I help you analyze the background check data today?" }],
  folderId: initialFolderId,
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Recruiter');
  const [activeView, setActiveView] = useState<'chat' | 'audit' | 'analytics'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasWidgets, setCanvasWidgets] = useState<CanvasWidget[]>([]);

  const [comparisonState, setComparisonState] = useState({
    isOpen: false,
    sourceWidgetId: null as string | null,
  });

  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(initialFolderId);

  const [conversations, setConversations] = useState<Conversation[]>([initialConversation]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversation.id);

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'New Chat',
      messages: [{ role: 'assistant', content: "How can I help you analyze the background check data today?" }],
      folderId: activeFolderId,
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
    // Advanced reply parsing logic from the first file
    let widgetType: CanvasWidget["type"] = "text";
    let widgetData: any = { content: "Could not display the response." }; // Default data
  
    // Check if reply is an array (most common case for complex data)
    if (Array.isArray(reply) && reply.length > 0) {
      const firstItem = reply[0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        // Case 1: RAG data is directly in the object
        if (firstItem.RAG) {
          widgetType = "text";
          widgetData = { content: firstItem.RAG };
        } 
        // Case 2: SQL data is nested inside a SQL property
        else if (firstItem.SQL && Array.isArray(firstItem.SQL) && firstItem.SQL.length > 0) {
          const sqlContent = firstItem.SQL[0];
          if (sqlContent.SQL_DATA && Array.isArray(sqlContent.SQL_DATA)) {
            widgetType = "table";
            widgetData = sqlContent.SQL_DATA;
          } else if (sqlContent.SQL_CHART) {
            // "chart" type can be used for custom chart components
            widgetType = "text"; 
            widgetData = { content: JSON.stringify(sqlContent.SQL_CHART) };
          }
        } 
        // Case 3: Tabular data without specific keys
        else {
            widgetType = "table";
            widgetData = reply;
        }
      } else {
         widgetData = { content: String(reply) };
      }
    } else if (typeof reply === 'string') {
        widgetType = "text";
        widgetData = { content: reply };
    }
  
    const newWidget: CanvasWidget = {
      id: `widget_${Date.now()}`,
      type: widgetType,
      title: `Response to: "${prompt}"`,
      data: widgetData,
      query: prompt,
    };
    setCanvasWidgets(prev => [...prev, newWidget]);
    setIsCanvasOpen(true);
  };
  
  const handleSelectFolder = (folderId: string) => {
    setActiveFolderId(folderId);
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: newName } : f));
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
    setConversations(prev => prev.map(c => c.folderId === folderId ? { ...c, folderId: null } : c));
    if (activeFolderId === folderId) {
      setActiveFolderId(null);
    }
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
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <div>
              <h2 className="text-2xl font-semibold">Welcome to AccuQuery AI</h2>
              <p>Start a new conversation or select one to begin.</p>
            </div>
          </div>
        );
    }
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
     <div className="min-h-screen bg-background text-foreground flex flex-col">
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
           folders={folders}
           activeFolderId={activeFolderId}
           onSelectFolder={handleSelectFolder}
           onRenameFolder={handleRenameFolder}
           onDeleteFolder={handleDeleteFolder}
         />
         <main className="flex-1 flex flex-col overflow-y-auto">
           {renderActiveView()}
         </main>
         {isCanvasOpen && (
          <aside className="w-[450px] flex-shrink-0 border-l border-border flex flex-col">
              <header className="p-4 bg-background border-b border-border flex justify-between items-center flex-shrink-0">
                  <h2 className="text-lg font-bold text-foreground">Workspace</h2>
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
