import React, { useState } from 'react';
import { ChatSession } from '../types';
import ChatInterface from './ChatInterface';
import PersistentCanvas from './PersistentCanvas'; // Corrected Path

interface ChatWorkspaceProps {
    chat: ChatSession;
    onPromptSubmit: (prompt: string, chatId: string) => void;
    onWidgetRemove: (widgetId: string, chatId: string) => void;
    onWidgetCompare: (widgetId: string, chatId: string) => void;
}

const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({ chat, onPromptSubmit, onWidgetRemove, onWidgetCompare }) => {
    const [isCanvasOpen, setIsCanvasOpen] = useState(chat.widgets.length > 0);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    
    const handlePrompt = async (prompt: string) => {
        setIsLoading(true);
        await onPromptSubmit(prompt, chat.id);
        setIsLoading(false);
        if (!isCanvasOpen) setIsCanvasOpen(true);
    };

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex h-full">
                <div className={`${isCanvasOpen ? 'w-1/2 lg:w-1/3' : 'w-full'} transition-all duration-300 ease-in-out h-full`}>
                    <ChatInterface
                        key={chat.id}
                        messages={chat.messages}
                        onPromptSubmit={handlePrompt}
                        isLoading={isLoading} // Pass loading state
                    />
                </div>
                <div className={`${isCanvasOpen ? 'w-1/2 lg:w-2/3' : 'w-0'} transition-all duration-300 ease-in-out h-full flex flex-col`}>
                    {isCanvasOpen && (
                        <>
                            <header className="p-4 bg-white border-b border-gray-300 flex justify-between items-center flex-shrink-0">
                                <h2 className="text-2xl font-bold">Workspace</h2>
                                <button onClick={() => setIsCanvasOpen(false)} className="bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded">
                                    Close
                                </button>
                            </header>
                            <PersistentCanvas 
                                widgets={chat.widgets} 
                                onWidgetRemove={(widgetId) => onWidgetRemove(widgetId, chat.id)}
                                onWidgetCompare={(widgetId) => onWidgetCompare(widgetId, chat.id)}
                                layout="grid"
                             />
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

export default ChatWorkspace;