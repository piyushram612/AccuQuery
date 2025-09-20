import React from 'react';
import { Canvas } from '../types';
import { Plus } from 'lucide-react';

interface CanvasTabsProps {
  canvases: Canvas[];
  activeCanvasId: string | null;
  onSelectCanvas: (id: string) => void;
  onNewCanvas: () => void;
}

const CanvasTabs: React.FC<CanvasTabsProps> = ({ canvases, activeCanvasId, onSelectCanvas, onNewCanvas }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b flex-shrink-0">
      {canvases.map(canvas => (
        <button
          key={canvas.id}
          onClick={() => onSelectCanvas(canvas.id)}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
            canvas.id === activeCanvasId
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {canvas.title}
        </button>
      ))}
      <button
        onClick={onNewCanvas}
        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        title="New Workspace"
      >
        <Plus size={16} className="text-gray-600" />
      </button>
    </div>
  );
};

export default CanvasTabs;