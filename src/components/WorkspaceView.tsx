import React from 'react';
import { Link } from 'react-router-dom';
import { ChatSession } from '../types';
import PersistentCanvas from './PersistentCanvas';
import { FiArrowLeft } from 'react-icons/fi';

interface WorkspaceViewProps {
    chat: ChatSession;
    onWidgetRemove: (widgetId: string) => void;
}

const WorkspaceView: React.FC<WorkspaceViewProps> = ({ chat, onWidgetRemove }) => {
    return (
        <div className="flex flex-col h-full">
            <header className="p-4 bg-white border-b flex justify-between items-center flex-shrink-0">
                <div className='flex items-center gap-4'>
                    <Link to={`/chat/${chat.id}`} className="p-2 rounded-md hover:bg-gray-200" title="Back to Chat">
                        <FiArrowLeft />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold">Workspace</h2>
                        <p className='text-sm text-gray-500'>For chat: "{chat.title}"</p>
                    </div>
                </div>
            </header>
            <PersistentCanvas
                widgets={chat.widgets}
                layout="grid"
                onWidgetRemove={onWidgetRemove}
                onWidgetCompare={() => {}} // Placeholder for compare functionality
            />
        </div>
    );
}

export default WorkspaceView;