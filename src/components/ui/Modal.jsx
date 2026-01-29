import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, type = 'default' }) => {
  // ESC key se modal close karne ke liye
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    danger: 'border-t-4 border-red-500',
    default: 'border-slate-100'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Overlay with heavy blur */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`
        relative bg-white rounded-3xl max-w-md w-full p-2
        border ${typeStyles[type]} shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]
        animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between ps-4 pt-2 p-3 border-b border-slate-300">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-slate-500 hover:text-slate-900 active:scale-90 duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 text-slate-600 text-sm font-medium leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer ? (
          <div className="flex gap-3 justify-end px-8 py-6 bg-slate-50/50 rounded-b-[2.5rem]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;