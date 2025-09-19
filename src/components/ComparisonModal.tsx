import React, { useState } from 'react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Create Comparison</h2>
        <p className="mb-4 text-gray-600">Enter a new query to compare with the selected record.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="e.g., Show me the same data for last quarter"
            autoFocus
          />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700">Compare</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComparisonModal;