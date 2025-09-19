import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // If the modal is not open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    // Portal to render the modal at the root level might be better for complex apps,
    // but for now, this fixed-position approach is simpler and effective.
    <div 
      // This is the dark backdrop
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose} // Optional: close the modal when clicking the backdrop
    >
      <div 
        // This is the modal content container
        // We use w-11/12 and h-5/6 to make it large but not quite full screen.
        className="relative w-11/12 h-5/6 bg-white rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()} // Prevents clicks inside the modal from closing it
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;