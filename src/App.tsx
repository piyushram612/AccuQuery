import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { UserRole, CanvasWidget, ChatSession, Message } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AuditLog from './components/AuditLog';
import Analytics from './components/Analytics';
import WorkspaceView from './components/WorkspaceView';

const getTitleFromPrompt = (prompt: string) =>
  prompt.split(' ').slice(0, 5).join(' ') + (prompt.split(' ').length > 5 ? '...' : '');

const N8N_WEBHOOK_URL = "https://accuquery.app.n8n.cloud/webhook/265defbb-0f2c-43ee-bf73-db1cddeec134";

function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Recruiter');
  const [activeView, setActiveView] = useState<'chat' | 'audit' | 'analytics'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('accuquery-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('accuquery-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const saved = localStorage.getItem('accuquery-sessions');
    return saved ? (JSON.parse(saved)[0]?.id || null) : null;
  });

  const handlePromptSubmit = async (prompt: string, chatId: string) => {
    try {
      // Fetch data from n8n webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt }),
      });

      let replyData: any;

      if (!response.ok) {
        // If HTTP status not OK, capture error text
        const errorText = await response.text();
        replyData = { error: `HTTP ${response.status}: ${errorText}` };
      } else {
        // Parse JSON reply
        replyData = await response.json();
      }

      setSessions(prevSessions =>
        prevSessions.map(session => {
          if (session.id === chatId) {
            const isTable = Array.isArray(replyData) && replyData.length > 0 && typeof replyData[0] === 'object';
            const widgetType = isTable ? 'table' : 'text';
            const newWidget: CanvasWidget = {
              id: `widget_${Date.now()}`,
              type: widgetType,
              title: `Response to: "${prompt}"`,
              data: replyData,
              query: prompt,
              timestamp: new Date().toISOString(),
              position: { x: 0, y: 0 },
              size: { width: 300, height: 200 },
            };
            const newTitle = session.title === 'New Chat' ? getTitleFromPrompt(prompt) : session.title;
            const userMessage: Message = { role: 'user', content: prompt };
            const botContent = replyData.error ? replyData.error :
              isTable ? "I've generated a table with your data." : JSON.stringify(replyData);
            const botMessage: Message = { role: 'assistant', content: botContent, hasWidget: true };
            return {
              ...session,
              title: newTitle,
              messages: [...session.messages, userMessage, botMessage],
              widgets: [...session.widgets, newWidget],
            };
          }
          return session;
        })
      );
    } catch (error) {
      const errMsg = (error instanceof Error) ? error.message : String(error);
      setSessions(prevSessions =>
        prevSessions.map(session => {
          if (session.id === chatId) {
            const errorWidget: CanvasWidget = {
              id: `widget_${Date.now()}`,
              type: 'text',
              title: `Response to: "${prompt}"`,
              data: { error: `Network error: ${errMsg}` },
              query: prompt,
              timestamp: new Date().toISOString(),
              position: { x: 0, y: 0 },
              size: { width: 300, height: 200 },
            };
            const newTitle = session.title === 'New Chat' ? getTitleFromPrompt(prompt) : session.title;
            const userMessage: Message = { role: 'user', content: prompt };
            const botMessage: Message = { role: 'assistant', content: `Network error: ${errMsg}`, hasWidget: true };
            return {
              ...session,
              title: newTitle,
              messages: [...session.messages, userMessage, botMessage],
              widgets: [...session.widgets, errorWidget],
            };
          }
          return session;
        })
      );
    }
  };

  const handleWidgetRemove = useCallback((widgetId: string) => {
    if (!activeChatId) return;
    setSessions(prev =>
      prev.map(s =>
        s.id === activeChatId ? { ...s, widgets: s.widgets.filter(w => w.id !== widgetId) } : s
      )
    );
  }, [activeChatId]);

  const handleNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Chat',
      messages: [{ role: 'assistant', content: "How can I help you today?" }],
      widgets: [],
    };
    setSessions(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    navigate(`/chat/${newChatId}`);
  };

  const ActiveChat = () => {
    const activeChat = sessions.find(c => c.id === activeChatId);
    if (!activeChat) {
      return <div className="flex-1 flex items-center justify-center bg-gray-50"><p>Select or start a new chat.</p></div>;
    }
    return (
      <ChatInterface
        key={activeChatId}
        chat={activeChat}
        onPromptSubmit={handlePromptSubmit}
        isLoading={false}
      />
    );
  };

  const ActiveWorkspace = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const activeChat = sessions.find(c => c.id === chatId);
    if (!activeChat) return <Navigate to="/chat" replace />;
    return <WorkspaceView chat={activeChat} onWidgetRemove={handleWidgetRemove} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            if (view === 'chat' && activeChatId) {
              navigate(`/chat/${activeChatId}`);
            } else {
              navigate(`/${view}`);
            }
          }}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          chats={sessions}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={setActiveChatId}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/chat/:chatId?" element={<ActiveChat />} />
            <Route path="/workspace/:chatId" element={<ActiveWorkspace />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/" element={<Navigate to={`/chat/${activeChatId || ''}`} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
