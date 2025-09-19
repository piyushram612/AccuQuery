// src/components/ChatInterface.tsx

import React, { useState, useRef } from 'react';

const N8N_WEBHOOK_URL = "https://accuquery.app.n8n.cloud/webhook/265defbb-0f2c-43ee-bf73-db1cddeec134";

function isTabular(data: unknown): data is Array<Record<string, unknown>> {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';
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
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ question: input });
      const res = await fetch(`${N8N_WEBHOOK_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      let data = await res.json();
      if (!Array.isArray(data)) data = [data];
      setMessages(prev => [...prev, { role: 'assistant', content: data }]);
      if (onReply) onReply(data, input);
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
              {msg.role === 'assistant' && isTabular(msg.content) ? (
                <table className="min-w-full text-xs border">
                  <thead>
                    <tr>
                      {Object.keys((msg.content as Array<Record<string, unknown>>)[0]).map((col) => (
                        <th key={col} className="border px-2 py-1 bg-gray-200">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(msg.content as Array<Record<string, unknown>>).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="border px-2 py-1">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span>{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</span>
              )}
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

