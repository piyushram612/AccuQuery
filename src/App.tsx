import { useState, useCallback } from 'react';
import { UserRole, CanvasWidget, CanvasLayout } from './types';
import { Button } from "@/components/ui/button"; // Add this import

// --- Import all your components ---
import Header from './components/Header';
import Sidebar from './components/Sidebar';
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
  const [canvasLayout, setCanvasLayout] = useState<CanvasLayout>('grid');

  // Comparison Modal State
  const [comparisonState, setComparisonState] = useState({
    isOpen: false,
    sourceWidgetId: null as string | null,
  });

  const handlePromptSubmit = async (prompt: string) => {
    const response = await processNLPQuery(prompt, selectedRole);
    const newWidget: CanvasWidget = {
      id: `widget_${Date.now()}`, type: response.type as CanvasWidget['type'],
      title: response.title, data: response.data, query: prompt,
      timestamp: new Date().toISOString(), position: calculateNextPosition(canvasWidgets),
      size: getDefaultSize(response.type as CanvasWidget['type'])
    };
    setCanvasWidgets(prev => [...prev, newWidget]);
    
    // Open canvas on prompt submit
    setIsCanvasOpen(true);
  };
  
  const handleCloseCanvas = () => {
    setIsCanvasOpen(false);
  };

  const handleWidgetCompare = (widgetId: string) => {
    setComparisonState({ isOpen: true, sourceWidgetId: widgetId });
  };

  const handleComparisonSubmit = async (comparisonPrompt: string) => {
    if (!comparisonState.sourceWidgetId) return;
    const sourceWidget = canvasWidgets.find(w => w.id === comparisonState.sourceWidgetId);
    if (!sourceWidget) return;
    
    const targetResponse = await processNLPQuery(comparisonPrompt, selectedRole);

    const comparisonWidget: CanvasWidget = {
      id: `widget_${Date.now()}`, type: 'comparison',
      title: `Comparison: ${sourceWidget.title} vs. ${targetResponse.title}`,
      query: `Compare "${sourceWidget.query}" with "${comparisonPrompt}"`,
      data: { source: sourceWidget, target: targetResponse },
      timestamp: new Date().toISOString(), position: calculateNextPosition(canvasWidgets),
      size: { width: 600, height: 250 }, relatedWidgets: [sourceWidget.id],
    };
    
    setCanvasWidgets(prev => [...prev, comparisonWidget]);
    setComparisonState({ isOpen: false, sourceWidgetId: null });
  };

  const handleWidgetRemove = useCallback((widgetId: string) => {
    setCanvasWidgets(prev => prev.filter(w => w.id !== widgetId));
  }, []);

  const handleChatReply = (reply: unknown, prompt: string) => {
    // Determine widget type
    let type: CanvasWidget['type'] = 'text';
    if (Array.isArray(reply) && reply.length > 0 && typeof reply[0] === 'object') type = 'table';
    // Create widget
    const newWidget: CanvasWidget = {
      id: `widget_${Date.now()}`,
      type,
      title: `Response to: "${prompt}"`,
      data: reply,
      query: prompt,
      timestamp: new Date().toISOString(),
      position: calculateNextPosition(canvasWidgets),
      size: getDefaultSize(type)
    };
    setCanvasWidgets(prev => [...prev, newWidget]);
    setIsCanvasOpen(true);
  };

  const renderActiveView = () => {
     switch (activeView) {
      case 'audit':
        return <AuditLog />;
      case 'analytics':
        return <Analytics />;
      case 'chat':
      default:
        return <ChatInterface onReply={handleChatReply} />;
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
         <Sidebar 
            activeView={activeView} 
            onViewChange={setActiveView}
            isOpen={sidebarOpen}
         />
         <main className="flex-1 flex flex-col overflow-hidden">
           <div className="flex-1 flex h-full">
               <div className={`${isCanvasOpen ? 'w-1/2 lg:w-1/3' : 'w-full'} transition-all duration-300 ease-in-out h-full`}>
                  {renderActiveView()}
               </div>
               {isCanvasOpen && (
                 <div className="w-1/2 lg:w-2/3 h-full flex flex-col transition-all duration-300 ease-in-out">
                    <header className="p-4 bg-white dark:bg-gray-900 border-b border-l border-gray-300 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Workspace</h2>
                      <Button
                        variant="outline"
                        onClick={handleCloseCanvas}
                      >
                        Close Workspace
                      </Button>
                    </header>
                    <PersistentCanvas
                      widgets={canvasWidgets}
                      onWidgetRemove={handleWidgetRemove}
                      onWidgetCompare={handleWidgetCompare}
                    />
                 </div>
               )}
           </div>
         </main>
       </div>
      <ComparisonModal
        isOpen={comparisonState.isOpen}
        onClose={() => setComparisonState({ isOpen: false, sourceWidgetId: null })}
        onSubmit={handleComparisonSubmit}
      />
    </div>
  );
}

export default App;