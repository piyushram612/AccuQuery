import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
// Import Textarea instead of Input
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, ArrowRight } from 'lucide-react';
import { Message } from '../types';

const N8N_WEBHOOK_URL = "https://accuquery.app.n8n.cloud/webhook/265defbb-0f2c-43ee-bf73-db1cddeec134";

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
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <span>{message.content}</span>
        {showWorkspaceButton && (
            <Button
                onClick={onGoToWorkspace}
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
  // Update ref to point to a Textarea element
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  // Update the event handler for the Textarea
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but allow new lines with Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4 bg-background text-foreground">
      <div className="flex-shrink-0 border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground">Your personal Assistant</h2>
        <p className="text-muted-foreground">Your conversational gateway to background check data.</p>
      </div>

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto pt-4 mb-4 pr-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} onGoToWorkspace={onGoToWorkspace} />
        ))}
        {loading && (
          <div className="flex justify-start items-center my-2">
             <div className="max-w-xl p-3 rounded-lg bg-muted">
               <span className="animate-pulse text-muted-foreground">AccuQuery is thinking...</span>
             </div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>

      {/* Changed items-center to items-end for better alignment with a taller input */}
      <div className="flex items-end gap-2 pt-4 border-t border-border">
        {/* Replaced Input with Textarea */}
        <Textarea
          ref={inputRef}
          className="flex-1 resize-none"
          placeholder="Ask a question about your data... (Shift + Enter for new line)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={3} // Sets the initial height to be 3 lines tall
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          size="icon"
          className="self-end" // Ensure button aligns to the bottom
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;