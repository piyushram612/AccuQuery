import React, { useState, useRef } from 'react';

const N8N_WEBHOOK_URL = "https://accuquery.app.n8n.cloud/webhook/265defbb-0f2c-43ee-bf73-db1cddeec134";

function isTabular(data: unknown): data is Array<Record<string, unknown>> {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && Object.keys(data[0]).length > 1;
}

const initialMessages = [
  { role: 'assistant', content: "How can I help you analyze the background check data today?" }
];

interface ChatInterfaceProps {
  onReply?: (reply: unknown, prompt: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onReply }) => {
  const [messages, setMessages] = useState<{ role: string; content: unknown }[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams({ question: input });
      const res = await fetch(`${N8N_WEBHOOK_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      let data = await res.json();
      
      // Ensure data is always an array for consistency
      if (!Array.isArray(data)) data = [data];

      // --- THIS IS THE FIX ---
      // 1. Always send the full, raw data to App.tsx for the workspace
      if (onReply) onReply(data, input);
      
      // 2. Determine what content to actually display in THIS chat window
      let chatDisplayContent: string;
      if (isTabular(data)) {
        // If the data is a table, just show a confirmation message.
        chatDisplayContent = "I've generated a table with your data and added it to the workspace.";
      } else {
        // Otherwise, it's a simple text response. Extract it or stringify as a fallback.
        const firstItem = data[0];
        if (typeof firstItem === 'object' && firstItem !== null) {
            const potentialText = (firstItem as any).response || (firstItem as any).result || (firstItem as any).answer;
            chatDisplayContent = typeof potentialText === 'string' ? potentialText : JSON.stringify(firstItem);
        } else {
            chatDisplayContent = String(firstItem);
        }
      }
      
      // 3. Add the clean message to the chat history
      setMessages(prev => [...prev, { role: 'assistant', content: chatDisplayContent }]);

    } catch (err) {
      let msg = "An error occurred.";
      if (err instanceof Error) msg = `An error occurred: ${err.message}`;
      setError(msg);
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
      setInput("");
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">💬 AccuQuery AI Assistant</h2>
      <p className="text-gray-500 mb-4">Your conversational gateway to background check data.</p>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                {/* This rendering logic now only receives simple strings for tables */}
                <span>{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center items-center my-2">
            <span className="animate-pulse text-gray-400">AccuQuery is thinking...</span>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-xs mt-2">{error}</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          className="flex-1 border rounded px-3 py-2 text-sm"
          type="text"
          placeholder="Ask a question about your data..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;