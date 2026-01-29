import React, { useEffect } from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const FilterDrawer = ({ 
  isOpen, 
  onClose, 
  onApply, 
  onClear,
  title = 'Search Filters',
  children 
}) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Heavy Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-[101] p-4">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="h-full w-full bg-white rounded-3xl p-5 flex flex-col"
            >
              {/* Header: Industrial Style */}
              <div className="flex items-center justify-between p-2 pb-6 border-b border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                    <Filter size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 uppercase tracking-tight leading-none">
                      {title}
                    </h2>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
                      Refine your results
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content: Scrollable Area */}
              <div className="flex-1 overflow-y-auto py-5 px-2">
                {children}
              </div>

              {/* Footer: Action Panel */}
              <div className="pt-6 border-t border-slate-300">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClear}
                    icon={RotateCcw}
                    className='px-8'
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => {
                      onApply();
                      onClose();
                    }}
                    icon={Check}
                    variant='dark'
                    className='grow'
                  >
                    Apply Filters
                  </Button>
                </div>
                
                {/* Optional: Utility hint */}
                <p className="text-center text-[9px] text-slate-500 font-medium uppercase tracking-widest mt-5">
                  Click outside to cancel
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;