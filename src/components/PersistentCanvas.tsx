import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Copy, X } from 'lucide-react';
import { CanvasWidget } from '../types';

// --- Merged WidgetCard Component (from version 2) with Theming ---
interface WidgetCardProps {
  widget: CanvasWidget;
  onRemove: (id: string) => void;
  onCompare: (id: string) => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ widget, onRemove, onCompare }) => {
  const [expanded, setExpanded] = useState(false);

  // Advanced rendering logic from version 2, now themed
  const renderWidgetContent = () => {
    switch (widget.type) {
      case "table":
        if (Array.isArray(widget.data) && widget.data.length > 0) {
          const isExpandable = widget.data.length > 3;
          return (
            <>
              <div className="overflow-auto" style={{ maxHeight: expanded ? "300px" : "150px" }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(widget.data[0]).map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(expanded ? widget.data : widget.data.slice(0, 3)).map((row: any, i: number) => (
                      <TableRow key={i}>
                        {Object.values(row).map((val, j) => (
                          <TableCell key={j} className="text-xs">{String(val)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {isExpandable && (
                 <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => setExpanded(!expanded)}>
                  {expanded ? 'Show Less' : `Show All ${widget.data.length} rows`}
                </Button>
              )}
            </>
          );
        }
        return <p className="text-muted-foreground">No data available for this table.</p>;

      case "comparison":
        // This is a placeholder; you can implement the full comparison logic here.
        return <p className="text-muted-foreground">Comparison view is not yet implemented.</p>;

      case "text":
        return <p>{widget.data.content}</p>;

      case "metric":
        return <p className="text-3xl font-bold">{widget.data.value}</p>;

      default:
        return <p className="text-muted-foreground">Unsupported widget type.</p>;
    }
  };

  return (
    // Card component uses theme defaults
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onCompare(widget.id)}
              title="Compare"
            >
              <Copy size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(widget.id)}
              title="Remove"
            >
              <X size={16} />
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderWidgetContent()}
      </CardContent>
      <CardFooter>
          <p className="text-xs text-muted-foreground italic w-full truncate">Query: "{widget.query}"</p>
      </CardFooter>
    </Card>
  );
};


// --- Merged PersistentCanvas (from version 1) using the new WidgetCard ---
interface PersistentCanvasProps {
  widgets: CanvasWidget[];
  onWidgetRemove: (widgetId: string) => void;
  onWidgetCompare: (widgetId:string) => void;
}

const PersistentCanvas: React.FC<PersistentCanvasProps> = ({
  widgets,
  onWidgetRemove,
  onWidgetCompare,
}) => {
  return (
    <div className="h-full w-full overflow-y-auto bg-background p-4">
      {widgets.length > 0 ? (
        <div className="space-y-4">
          {widgets.map((widget) => (
             <WidgetCard
                key={widget.id}
                widget={widget}
                onRemove={onWidgetRemove}
                onCompare={onWidgetCompare}
              />
          )).reverse() /* Show newest widgets at the top */}
        </div>
      ) : (
        <div className="text-center text-muted-foreground pt-16 w-full">
          <p className="text-lg">Your workspace is empty.</p>
          <p className="text-sm">Ask a question to add items to your workspace.</p>
        </div>
      )}
    </div>
  );
};

export default PersistentCanvas;