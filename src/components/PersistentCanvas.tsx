import React, { useRef, useEffect, useState } from 'react';
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
  index: number;
  draggingBoxId: string | null;
  setDraggingBoxId: (id: string | null) => void;
  updateTouched: (id: string) => void;
  zIndex: number;
}> = ({
  widget,
  onRemove,
  onCompare,
  index,
  draggingBoxId,
  setDraggingBoxId,
  updateTouched,
  zIndex,
}) => {
  const [expanded, setExpanded] = useState(false);

  // --- FIX: spread widgets apart by default (grid-like absolute positioning) ---
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem(`widget-pos-${widget.id}`);
    if (saved) return JSON.parse(saved);
    const colWidth = 380; // spacing horizontally
    const rowHeight = 260; // spacing vertically
    const startX = 40;
    const startY = 40;
    return {
      x: startX + (index % 3) * colWidth,
      y: startY + Math.floor(index / 3) * rowHeight,
    };
  });

  const dragging = useRef(false);
  const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(`widget-pos-${widget.id}`, JSON.stringify(position));
  }, [position, widget.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== dragHandleRef.current) return;
    dragging.current = true;
    setDraggingBoxId(widget.id);
    updateTouched(widget.id);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = (e?: MouseEvent) => {
    dragging.current = false;
    setDraggingBoxId(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (e && window.innerHeight - e.clientY < 100) {
      // reset to first available grid slot
      const columns = 3;
      const cellWidth = 380;
      const cellHeight = 260;
      const startX = 40;
      const startY = 40;
      const usedPositions: { x: number; y: number }[] = [];
      document.querySelectorAll('[data-widget-pos]')?.forEach((el) => {
        const pos = el.getAttribute('data-widget-pos');
        if (pos) {
          const [x, y] = pos.split(',').map(Number);
          usedPositions.push({ x, y });
        }
      });
      let found = false;
      for (let row = 0; row < 20 && !found; row++) {
        for (let col = 0; col < columns; col++) {
          const pos = {
            x: startX + col * cellWidth,
            y: startY + row * cellHeight,
          };
          if (!usedPositions.some((u) => u.x === pos.x && u.y === pos.y)) {
            setPosition(pos);
            found = true;
            break;
          }
        }
      }
      if (!found) setPosition({ x: startX, y: startY });
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col break-words"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex,
        width: 360,
      }}
      onMouseDown={handleMouseDown}
      data-widget-pos={`${position.x},${position.y}`}
    >
      {/* Drag handle */}
      <div
        ref={dragHandleRef}
        className="flex flex-col items-center cursor-grab mb-2 select-none"
        style={{ userSelect: 'none' }}
        title="Drag to move"
        onClick={() => updateTouched(widget.id)}
      >
        <div className="w-8 h-1 bg-gray-400 mb-1 rounded" />
        <div className="w-8 h-1 bg-gray-400 rounded" />
      </div>

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
          <button
            onClick={() => onRemove(widget.id)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        className="flex-grow"
        onClick={() => setExpanded(true)}
        style={{ cursor: 'pointer' }}
      >
        {/* Table preview / expand logic */}
        {Array.isArray(widget.data) &&
        widget.data.length > 0 &&
        typeof widget.data[0] === 'object' ? (
          expanded ? (
            <div className="overflow-auto max-h-96 max-w-full">
              <table className="text-xs border">
                <thead>
                  <tr>
                    {Object.keys(widget.data[0]).map((col) => (
                      <th key={col} className="border px-2 py-1 bg-gray-200">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {widget.data.map((row: any, i: number) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border px-2 py-1">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="mt-2 px-3 py-1 bg-gray-200 rounded text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="overflow-auto max-w-full">
              <table className="text-xs border">
                <thead>
                  <tr>
                    {Object.keys(widget.data[0]).map((col) => (
                      <th key={col} className="border px-2 py-1 bg-gray-200">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {widget.data.slice(0, 3).map((row: any, i: number) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border px-2 py-1">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-xs text-blue-500 mt-1">
                Click to expand and view all rows
              </div>
            </div>
          )
        ) : widget.type === 'comparison' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600">
                {widget.data.source.title}
              </h4>
              <p className="text-xs text-gray-500">
                {widget.data.source.data.content}
              </p>
            </div>
            <div className="border-l pl-4">
              <h4 className="font-semibold text-sm text-gray-600">
                {widget.data.target.title}
              </h4>
              <p className="text-xs text-gray-500">
                {widget.data.target.data.content}
              </p>
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
  const [draggingBoxId, setDraggingBoxId] = useState<string | null>(null);
  const [touchedMap, setTouchedMap] = useState<{ [id: string]: number }>(() => {
    const map: { [id: string]: number } = {};
    widgets.forEach((w) => {
      map[w.id] = Date.now();
    });
    return map;
  });

  const updateTouched = (id: string) => {
    setTouchedMap((prev) => ({ ...prev, [id]: Date.now() }));
  };

  const sortedWidgets = [...widgets].sort((a, b) => {
    const ta = touchedMap[a.id] || 0;
    const tb = touchedMap[b.id] || 0;
    return tb - ta;
  });

  return (
    <div className="h-full w-full relative bg-gray-100 flex-grow">
      {draggingBoxId && (
        <div className="fixed bottom-0 left-0 w-full h-16 bg-gray-300 flex items-center justify-center z-50 opacity-80 pointer-events-none">
          <span className="text-gray-700 text-sm">
            Drop here to reset position
          </span>
        </div>
      )}

      {widgets.length === 0 ? (
        <div className="text-center text-gray-500 pt-16">
          <p className="text-lg">Your workspace is empty.</p>
          <p className="text-sm text-gray-400">
            Ask a question to add a widget.
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {sortedWidgets.map((widget, idx) => (
            <Widget
              key={widget.id}
              widget={widget}
              onRemove={onWidgetRemove}
              onCompare={onWidgetCompare}
              index={idx}
              draggingBoxId={draggingBoxId}
              setDraggingBoxId={setDraggingBoxId}
              updateTouched={updateTouched}
              zIndex={100 + sortedWidgets.length - idx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PersistentCanvas;
