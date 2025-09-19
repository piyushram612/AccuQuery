// src/components/Canvas.tsx
import React from 'react';

interface CanvasProps {
  data: any; // Use a more specific type for your response data
  onClose: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <main className="flex-grow p-8 overflow-y-auto relative bg-white">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold p-2"
        title="Close Canvas"
      >
        Close
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
        <div className="prose max-w-none">
          <p>{data.content}</p>
        </div>
      </div>
    </main>
  );
};

export default Canvas;