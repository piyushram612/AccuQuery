import React, { useRef, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Copy, X } from "lucide-react";

interface CanvasWidget {
  id: string;
  type: "table" | "comparison" | "text" | "metric";
  title: string;
  query: string;
  data: any;
}

interface WidgetCardProps {
  widget: CanvasWidget;
  onRemove: (id: string) => void;
  onCompare: (id: string) => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ widget, onRemove, onCompare }) => {
  const dragRef = useRef<HTMLDivElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current) {
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp, { once: true });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case "table":
        if (Array.isArray(widget.data) && widget.data.length > 0) {
          return (
            <div className="overflow-auto" style={{ maxHeight: expanded ? "250px" : "none" }}>
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
                        <TableCell key={j}>{String(val)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        }
        return <p>No data available</p>;

      case "comparison":
        return (
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
        );

      case "text":
        return <p>{widget.data.content}</p>;

      case "metric":
        return <p className="text-4xl font-bold">{widget.data.value}</p>;

      default:
        return null;
    }
  };

  return (
    <Card
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: 380,
        maxHeight: "90vh",
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={dragRef}
        className="flex flex-col items-center cursor-grab py-2 select-none"
        title="Drag to move"
      >
        <div className="w-8 h-1 bg-gray-300 dark:bg-gray-700 mb-1 rounded-full" />
        <div className="w-6 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>

      <CardHeader className="flex flex-row items-start justify-between pb-2 pt-0">
        <CardTitle className="text-base font-semibold">{widget.title}</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onCompare(widget.id)}
            title="Compare"
          >
            <Copy size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-500"
            onClick={() => onRemove(widget.id)}
            title="Remove"
          >
            <X size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-grow py-2 text-sm overflow-hidden">{renderWidgetContent()}</CardContent>

      <CardFooter className="py-2 mt-auto">
        <p className="text-xs text-gray-500 dark:text-gray-400">Query: "{widget.query}"</p>
      </CardFooter>
    </Card>
  );
};

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
  const latestWidget = widgets.length > 0 ? widgets[widgets.length - 1] : null;

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      {latestWidget ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full h-full flex flex-col">
            <h3 className="font-bold text-2xl mb-4">{latestWidget.title}</h3>
            <div className="flex-grow overflow-auto">
              {Array.isArray(latestWidget.data) &&
              latestWidget.data.length > 0 &&
              typeof latestWidget.data[0] === "object" ? (
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr>
                      {Object.keys(latestWidget.data[0]).map((col) => (
                        <th key={col} className="border px-2 py-1 bg-gray-200">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {latestWidget.data.map((row: any, i: number) => (
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
              ) : latestWidget.type === "comparison" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">{latestWidget.data.source.title}</h4>
                    <p className="text-xs text-gray-500">{latestWidget.data.source.data.content}</p>
                  </div>
                  <div className="border-l pl-4">
                    <h4 className="font-semibold text-sm text-gray-600">{latestWidget.data.target.title}</h4>
                    <p className="text-xs text-gray-500">{latestWidget.data.target.data.content}</p>
                  </div>
                </div>
              ) : latestWidget.type === "text" ? (
                <p>{latestWidget.data.content}</p>
              ) : latestWidget.type === "metric" ? (
                <p className="text-4xl font-bold">{latestWidget.data.value}</p>
              ) : null}
              <p className="text-xs text-gray-400 mt-4">Query: "{latestWidget.query}"</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 pt-16 w-full">
          <p className="text-lg">Your workspace is empty.</p>
          <p className="text-sm text-gray-400">Ask a question to add a widget.</p>
        </div>
      )}
    </div>
  );
};

export default PersistentCanvas;