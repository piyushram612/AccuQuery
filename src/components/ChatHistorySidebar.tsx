import React from 'react';
import { Plus, MessageSquare, MoreHorizontal, Edit, Trash2, Search, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Conversation, Folder as FolderType } from '../types';
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
  folders: FolderType[];
  activeFolderId: string | null;
  onSelectFolder: (id: string) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onDeleteFolder: (id: string) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  folders,
  activeFolderId,
  onSelectFolder,
  onRenameFolder,
  onDeleteFolder,
}) => {

  const handleRename = (id: string) => {
    const newTitle = prompt("Enter new chat title:");
    if (newTitle && newTitle.trim()) {
      onRenameConversation(id, newTitle.trim());
    }
  };
  
  const handleFolderRename = (id: string) => {
    const newName = prompt("Enter new folder name:");
    if (newName && newName.trim()) {
      onRenameFolder(id, newName.trim());
    }
  };

  const filteredConversations = conversations.filter(c => c.folderId === activeFolderId);

  return (
    <aside
      className={cn(
        'bg-background text-foreground flex-shrink-0 transition-all duration-300 ease-in-out border-r flex flex-col overflow-hidden',
        isOpen ? 'w-72' : 'w-0'
      )}
    >
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search"
                className="w-full bg-background border-border rounded-md pl-9 h-9 text-sm"
            />
        </div>
      </div>

      {/* Main content area (scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Folders Section */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Folders</h3>
          <ul className="space-y-1">
            {folders.map((folder) => {
                const isActive = folder.id === activeFolderId;
                return (
              <li key={folder.id}>
                <div className="w-full flex items-center p-2 text-sm rounded-md hover:bg-accent group relative">
                   <span className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full",
                    isActive ? "bg-green-500" : "bg-transparent"
                  )}></span>
                  <button onClick={() => onSelectFolder(folder.id)} className="flex-1 flex items-center text-left">
                    <Folder className="mr-3 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1 text-foreground">{folder.name}</span>
                  </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-accent-foreground/10 hover:text-foreground opacity-0 group-hover:opacity-100">
                                <MoreHorizontal size={16}/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
                            <DropdownMenuItem onClick={() => handleFolderRename(folder.id)} className="focus:bg-accent">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteFolder(folder.id)} className="text-destructive focus:text-destructive focus:bg-accent">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </li>
            )})}
          </ul>
        </div>

        {/* Chats Section */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Chats</h3>
          {filteredConversations.length > 0 ? (
            <ul className="space-y-1">
              {filteredConversations.map((chat) => {
                const isActive = chat.id === activeConversationId;
                const subtitle = chat.messages[1]?.content || '';
                return (
                  <li key={chat.id} className={cn("group rounded-md relative", isActive && "bg-accent")}>
                     <span className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full",
                        isActive ? "bg-green-500" : "bg-transparent"
                     )}></span>
                    <div className="flex items-center p-2">
                        <button onClick={() => onSelectConversation(chat.id)} className="flex-1 flex items-start text-left overflow-hidden">
                            <MessageSquare className="mr-3 h-4 w-4 flex-shrink-0 mt-1 text-muted-foreground" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-foreground truncate">{chat.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                            </div>
                        </button>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-accent-foreground/10 hover:text-foreground">
                                        <MoreHorizontal size={16}/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
                                    <DropdownMenuItem onClick={() => handleRename(chat.id)} className="focus:bg-accent">
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Rename</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onDeleteConversation(chat.id)} className="text-destructive focus:text-destructive focus:bg-accent">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground text-sm mt-4 px-2">
              <p>No conversations in this folder.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* New Chat Button */}
      <div className="p-4 mt-auto border-t">
        <Button
          onClick={onNewConversation}
          className="w-full justify-between bg-green-500 hover:bg-green-600 text-white font-semibold text-base py-3 h-auto rounded-lg"
        >
          <span>New chat</span>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </aside>
  );
};

export default ChatHistorySidebar;