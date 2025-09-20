import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { X } from 'lucide-react';
import { CanvasWidget } from '../types';

interface PersistentCanvasProps {
  widgets: CanvasWidget[];
  onWidgetRemove: (widgetId: string) => void;
  onWidgetCompare: (widgetId: string) => void;
}

const renderWidgetContent = (widget: CanvasWidget) => {
  switch (widget.type) {
    case "table":
      if (Array.isArray(widget.data) && widget.data.length > 0 && typeof widget.data[0] === 'object') {
        return (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(widget.data[0]).map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {widget.data.map((row: any, i: number) => (
                  <TableRow key={i}>
                    {Object.values(row).map((val, j) => (
                      <TableCell key={j}>{String(val)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      }
      return <p className="text-muted-foreground">No data available for this table.</p>;

    case "comparison":
      // Placeholder for comparison view
      return <p className="text-muted-foreground">Comparison view is not yet implemented.</p>;

    case "text":
      return <p>{widget.data.content}</p>;

    case "metric":
      return <p className="text-3xl font-bold">{widget.data.value}</p>;

    default:
      return <p className="text-muted-foreground">Unsupported widget type.</p>;
  }
};

const PersistentCanvas: React.FC<PersistentCanvasProps> = ({
  widgets,
  onWidgetRemove,
  onWidgetCompare,
}) => {
  return (
    // Use theme variable for the main background
    <div className="h-full w-full overflow-y-auto bg-background p-4">
      {widgets.length > 0 ? (
        <div className="space-y-4">
          {widgets.map((widget) => (
            // Card component now defaults to the correct theme background (bg-card)
            <Card key={widget.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => onWidgetRemove(widget.id)}
                  title="Remove"
                >
                  <X size={16} />
                </Button>
              </CardHeader>
              <CardContent>
                {renderWidgetContent(widget)}
              </CardContent>
              <CardFooter>
                  <p className="text-xs text-muted-foreground italic w-full truncate">Query: "{widget.query}"</p>
              </CardFooter>
            </Card>
          )).reverse() /* Show newest widgets at the top */}
        </div>
      ) : (
        // Use theme variable for empty state text
        <div className="text-center text-muted-foreground pt-16 w-full">
          <p className="text-lg">Your workspace is empty.</p>
          <p className="text-sm">Ask a question to add items to your workspace.</p>
        </div>
      )}
    </div>
  );
};

export default PersistentCanvas;