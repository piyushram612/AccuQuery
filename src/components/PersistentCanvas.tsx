import React from 'react';
import { CanvasWidget, CanvasLayout } from '../types';
import { FiCopy } from 'react-icons/fi';

interface PersistentCanvasProps {
  widgets: CanvasWidget[];
  layout: CanvasLayout;
  onWidgetRemove: (widgetId: string) => void;
  onWidgetCompare: (widgetId: string) => void;
}

const Widget: React.FC<{
  widget: CanvasWidget;
  onRemove: (id: string) => void;
  onCompare: (id: string) => void;
}> = ({ widget, onRemove, onCompare }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{widget.title}</h3>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => onCompare(widget.id)} 
             className="text-blue-500 hover:text-blue-700"
             title="Compare this widget"
           >
             <FiCopy size={18} />
           </button>
           <button onClick={() => onRemove(widget.id)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
        </div>
      </div>
      <div className="flex-grow">
        {widget.type === 'comparison' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600">{widget.data.source.title}</h4>
              <p className="text-xs text-gray-500">{widget.data.source.data.content}</p>
            </div>
            <div className="border-l pl-4">
              <h4 className="font-semibold text-sm text-gray-600">{widget.data.target.title}</h4>
              <p className="text-xs text-gray-500">{widget.data.target.data.content}</p>
            </div>
          </div>
        ) : widget.type === 'text' ? (
            <p>{widget.data.content}</p>
        ) : widget.type === 'metric' ? (
            <p className="text-4xl font-bold">{widget.data.value}</p>
        ) : null}
        <p className="text-xs text-gray-400 mt-4">Query: "{widget.query}"</p>
      </div>
    </div>
  );
};

const PersistentCanvas: React.FC<PersistentCanvasProps> = ({
  widgets,
  layout,
  onWidgetRemove,
  onWidgetCompare,
}) => {
  return (
    <div className="h-full flex flex-col bg-gray-100 flex-grow">
      <div className="flex-grow p-4 overflow-y-auto">
        {widgets.length === 0 ? (
          <div className="text-center text-gray-500 pt-16">
            <p className="text-lg">Your workspace is empty.</p>
            <p className="text-sm text-gray-400">Ask a question to add a widget.</p>
          </div>
        ) : (
          <div className={`gap-4 ${layout === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'flex flex-col space-y-4'}`}>
            {widgets.map(widget => (
              <Widget
                key={widget.id}
                widget={widget}
                onRemove={onWidgetRemove}
                onCompare={onWidgetCompare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersistentCanvas;