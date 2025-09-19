import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface CanvasProps {
  data: any; // Use a more specific type for your response data
  onClose: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <main className="flex-grow p-8 overflow-y-auto relative bg-white dark:bg-gray-950">
       <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Close Canvas"
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{data.title}</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>{data.content}</p>
        </div>
      </div>
    </main>
  );
};

export default Canvas;