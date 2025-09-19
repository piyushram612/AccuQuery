import React, { useRef, useEffect, useState, memo } from 'react';
import { CanvasWidget } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Copy } from 'lucide-react';

interface WidgetProps {
  widget: CanvasWidget;
  onRemove: (id: string) => void;
  onCompare: (id: string) => void;
  index: number;
  updateTouched: (id: string) => void;
  zIndex: number;
}

const Widget: React.FC<WidgetProps> = memo(({
  widget,
  onRemove,
  onCompare,
  index,
  updateTouched,
  zIndex,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    // Initial positioning logic
    const colWidth = 400;
    const rowHeight = 320; // Increased row height for better spacing
    return {
      x: 20 + (index % 3) * colWidth,
      y: 20 + Math.floor(index / 3) * rowHeight,
    };
  });

  const dragRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current && dragRef.current.contains(e.target as Node)) {
        updateTouched(widget.id);
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp, { once: true });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'table':
        if (Array.isArray(widget.data) && widget.data.length > 0) {
          return (
            <div>
              {/* This div handles both vertical and horizontal scrolling within a constrained height when expanded */}
              <div className="overflow-auto" style={{ maxHeight: expanded ? '250px' : 'none' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(widget.data[0]).map(col => <TableHead key={col}>{col}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(expanded ? widget.data : widget.data.slice(0, 3)).map((row: any, i: number) => (
                      <TableRow key={i}>
                        {Object.values(row).map((val, j) => <TableCell key={j}>{String(val)}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {widget.data.length > 3 && (
                  <p 
                    className="text-xs text-blue-500 dark:text-blue-400 mt-2 text-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card drag from firing on click
                      setExpanded(!expanded);
                    }}
                  >
                      Click to {expanded ? 'collapse' : `view all ${widget.data.length} rows`}
                  </p>
              )}
            </div>
          );
        }
        return <p className="text-muted-foreground text-sm">No table data available.</p>;
      
      case 'comparison':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-card-foreground/80">
                {widget.data.source.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {widget.data.source.data?.content || JSON.stringify(widget.data.source.data)}
              </p>
            </div>
            <div className="border-l border-border pl-4">
              <h4 className="font-semibold text-sm text-card-foreground/80">
                {widget.data.target.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {widget.data.target.data?.content || JSON.stringify(widget.data.target.data)}
              </p>
            </div>
          </div>
        );

      case 'text':
        return <p>{widget.data.content}</p>;
      
      case 'metric':
        return <p className="text-4xl font-bold">{widget.data.value}</p>;

      default:
        return null;
    }
  }

  return (
    <Card
      className="absolute flex flex-col break-words"
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        width: 380,
        maxHeight: '90vh' // Prevent card from being too tall
      }}
      onMouseDown={handleMouseDown}
    >
      <div ref={dragRef} className="flex flex-col items-center cursor-grab py-2 select-none" title="Drag to move">
        <div className="w-8 h-1 bg-gray-300 dark:bg-gray-700 mb-1 rounded-full" />
        <div className="w-6 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>

      <CardHeader className="flex flex-row items-start justify-between pb-2 pt-0">
        <CardTitle className="text-base font-semibold">{widget.title}</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCompare(widget.id)} title="Compare">
            <Copy size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-500" onClick={() => onRemove(widget.id)} title="Remove">
            <X size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-grow py-2 text-sm overflow-hidden">
        {renderWidgetContent()}
      </CardContent>

      <CardFooter className="py-2 mt-auto">
         <p className="text-xs text-gray-500 dark:text-gray-400">Query: "{widget.query}"</p>
      </CardFooter>
    </Card>
  );
});

interface PersistentCanvasProps {
    widgets: CanvasWidget[];
    onWidgetRemove: (widgetId: string) => void;
    onWidgetCompare: (widgetId: string) => void;
}

const PersistentCanvas: React.FC<PersistentCanvasProps> = ({
  widgets,
  onWidgetRemove,
  onWidgetCompare,
}) => {
  const [touchedMap, setTouchedMap] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    setTouchedMap(prev => {
        const newMap = {...prev};
        widgets.forEach(w => {
            if(!newMap[w.id]) {
                newMap[w.id] = Date.now();
            }
        });
        return newMap;
    })
  }, [widgets]);

  const updateTouched = (id: string) => {
    setTouchedMap(prev => ({ ...prev, [id]: Date.now() }));
  };

  const sortedWidgets = [...widgets].sort((a, b) => (touchedMap[b.id] || 0) - (touchedMap[a.id] || 0));

  return (
    <div className="h-full w-full relative bg-gray-100 dark:bg-gray-900/80 flex-grow overflow-auto">
      {widgets.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 pt-16">
          <p className="text-lg">Your workspace is empty.</p>
          <p className="text-sm">Ask a question to add a widget.</p>
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
              updateTouched={updateTouched}
              zIndex={10 + sortedWidgets.length - idx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PersistentCanvas;
