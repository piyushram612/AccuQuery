import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowRight } from 'lucide-react';
import { Message } from '../types';

const N8N_WEBHOOK_URL = "https://accuquery.app.n8n.cloud/webhook/e2e7ddf2-c158-465a-ab98-3abcb09fa248";

function isTabular(data: unknown): data is Array<Record<string, unknown>> {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && Object.keys(data[0]).length > 1;
}

interface ChatInterfaceProps {
  initialMessages: Message[];
  onReply: (reply: unknown, prompt: string) => void;
  onGoToWorkspace: () => void;
}

const MessageBubble: React.FC<{ message: Message; onGoToWorkspace: () => void; }> = React.memo(({ message, onGoToWorkspace }) => {
  const isUser = message.role === 'user';
  const showWorkspaceButton = !isUser && message.content.includes('added the result to your workspace');
  
  return (
    <div className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xl p-3 rounded-lg text-sm md:text-base ${
          isUser
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200'
        }`}
      >
        <span>{message.content}</span>
        {showWorkspaceButton && (
            <Button
                onClick={onGoToWorkspace}
                // Removed variant and added custom, high-visibility classes
                className="mt-3 w-full h-10 bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
                Go to Workspace
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        )}
      </div>
    </div>
  );
});

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessages, onReply, onGoToWorkspace }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ question: currentInput });
      const res = await fetch(`${N8N_WEBHOOK_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      let data = await res.json();

      if (!Array.isArray(data)) data = [data];
      onReply(data, currentInput);

      let chatDisplayContent: string;
      if (isTabular(data) || (typeof data[0] === 'object' && data[0] !== null)) {
        chatDisplayContent = "I've added the result to your workspace — open Workspace to view the full output.";
      } else {
        chatDisplayContent = String(data[0] || "I received a response, but it was empty.");
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
    <div className="flex flex-col h-full w-full p-4 bg-white dark:bg-gray-900">
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your personal Assistant</h2>
        <p className="text-gray-500 dark:text-gray-400">Your conversational gateway to background check data.</p>
      </div>

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto pt-4 mb-4 pr-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} onGoToWorkspace={onGoToWorkspace} />
        ))}
        {loading && (
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

      <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
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