import { toast } from 'react-toastify';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

const toastConfig = {
  icon: false, // Hum custom icon manually inject karenge
  closeButton: false, // Custom look ke liye
};

export const showToast = {
  success: (msg) => toast.success(msg, {
    ...toastConfig,
    icon: <CheckCircle className="text-emerald-500" size={20} />,
    className: 'border-l-4 border-l-emerald-500' // High-end industrial touch
  }),
  
  error: (msg) => toast.error(msg, {
    ...toastConfig,
    icon: <XCircle className="text-red-500" size={20} />,
    className: 'border-l-4 border-l-red-500'
  }),

  info: (msg) => toast.info(msg, {
    ...toastConfig,
    icon: <Info className="text-blue-500" size={20} />,
    className: 'border-l-4 border-l-blue-500'
  }),

  warn: (msg) => toast.warn(msg, {
    ...toastConfig,
    icon: <AlertCircle className="text-amber-500" size={20} />,
    className: 'border-l-4 border-l-amber-500'
  })
};