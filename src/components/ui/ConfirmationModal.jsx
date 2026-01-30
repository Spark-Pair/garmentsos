import React from 'react';
import { AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import { Modal, Button } from "./index";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = "danger" 
}) {
  
  // Type ke hisaab se Icons aur Colors define karein
  const config = {
    danger: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-100'
    },
    info: {
      icon: HelpCircle,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100'
    }
  }[type] || config.danger;

  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-5">
        {/* Visual Cue Icon */}
        <div className={`w-20 h-20 ${config.bg} ${config.color} rounded-3xl flex items-center justify-center animate-bounce-short`}>
          <Icon size={40} strokeWidth={2.5} />
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <h4 className="text-xl font-black text-slate-900 tracking-tight">
            Are you sure?
          </h4>
          <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[280px] mx-auto">
            {message || "This action cannot be undone. Please confirm if you want to proceed."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button 
            variant="outline" 
            size='lg'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            size='lg'
            variant='danger'
          >
            Yes, Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}