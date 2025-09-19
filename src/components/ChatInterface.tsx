import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

const N8N_WEBHOOK_URL = "https://accuquery.app.n8n.cloud/webhook/265defbb-0f2c-43ee-bf73-db1cddeec134";

// A stricter type for chat messages for better type safety.
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Helper function to check if the response data is in a tabular format.
function isTabular(data: unknown): data is Array<Record<string, unknown>> {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && Object.keys(data[0]).length > 1;
}

const initialMessages: Message[] = [
  { role: 'assistant', content: "How can I help you analyze the background check data today?" }
];

interface ChatInterfaceProps {
  onReply?: (reply: unknown, prompt: string) => void;
}

// Optimized: A dedicated, memoized component for rendering message bubbles.
// This prevents re-rendering every message in the list when a new one is added.
const MessageBubble: React.FC<{ message: Message }> = React.memo(({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xl p-3 rounded-lg text-sm md:text-base ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200'
        }`}
      >
        <span>{message.content}</span>
      </div>
    </div>
  );
});


const ChatInterface: React.FC<ChatInterfaceProps> = ({ onReply }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // UX Optimization: Automatically scroll to the bottom when new messages arrive.
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput(""); // UX Optimization: Clear input immediately on send.
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ question: input });
      const res = await fetch(`${N8N_WEBHOOK_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      let data = await res.json();

      if (!Array.isArray(data)) data = [data];
      if (onReply) onReply(data, input);

      let chatDisplayContent: string;
      if (isTabular(data)) {
        chatDisplayContent = "I've generated a table with your data and added it to the workspace.";
      } else {
        const firstItem = data[0];
        if (typeof firstItem === 'object' && firstItem !== null) {
            const potentialText = (firstItem as any).response || (firstItem as any).result || (firstItem as any).answer;
            chatDisplayContent = typeof potentialText === 'string' ? potentialText : JSON.stringify(firstItem);
        } else {
            chatDisplayContent = String(firstItem);
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: chatDisplayContent }]);

    } catch (err) {
      const msg = err instanceof Error ? `An error occurred: ${err.message}` : "An unknown error occurred.";
      setError(msg);
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    // Dark Mode: Added dark mode classes for background and border.
    <div className="flex flex-col h-full w-full p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md">
      {/* Dark Mode: Added dark mode text colors. */}
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">💬 AccuQuery AI Assistant</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Your conversational gateway to background check data.</p>

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {loading && (
           // UX Optimization: Loading indicator now mimics a message bubble.
          <div className="flex justify-start items-center my-2">
             <div className="max-w-xl p-3 rounded-lg bg-gray-200 dark:bg-gray-800">
                <span className="animate-pulse text-gray-500 dark:text-gray-400">AccuQuery is thinking...</span>
             </div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Optimization: Replaced native input with Shadcn Input component. */}
        <Input
          ref={inputRef}
          className="flex-1"
          type="text"
          placeholder="Ask a question about your data..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        {/* Optimization: Replaced native button with Shadcn Button component. */}
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
