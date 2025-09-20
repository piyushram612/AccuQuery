import React from 'react';
import { PlusSquare, MessageSquare, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Conversation } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ 
  isOpen, 
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}) => {

  const handleRename = (id: string) => {
    const newTitle = prompt("Enter new chat title:");
    if (newTitle && newTitle.trim()) {
      onRenameConversation(id, newTitle.trim());
    }
  };

  return (
    <aside
      className={cn(
        'bg-white dark:bg-gray-900 flex-shrink-0 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden',
        isOpen ? 'w-64 p-4' : 'w-0'
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <Button variant="ghost" size="icon" title="New Chat" onClick={onNewConversation}>
          <PlusSquare className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto -mr-4 pr-3">
        {(conversations || []).length > 0 ? (
          <ul className="space-y-2">
            {(conversations || []).map((chat) => (
              <li key={chat.id} className="group relative">
                <button
                  onClick={() => onSelectConversation(chat.id)}
                  className={cn(
                    'w-full flex items-center p-2 rounded-md text-sm transition-colors text-left',
                    chat.id === activeConversationId
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <MessageSquare className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="truncate flex-1">{chat.title}</span>
                </button>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal size={16}/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleRename(chat.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteConversation(chat.id)} className="text-red-500 focus:text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>No conversations yet.</p>
            <p>Start a new chat to begin.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatHistorySidebar;