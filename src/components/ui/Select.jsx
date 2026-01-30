import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Framer motion import kiya

const Select = forwardRef(({
  label, error, options = [], placeholder = 'Choose option', 
  searchPlaceholder = 'Search...', className = '', containerClassName = '', 
  required = true, value, onChange, disabled = false, 
  emptyMessage = 'Nothing found', helperText, allowClear = true, 
  searchable = true, maxHeight = 'max-h-72', ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = searchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  useEffect(() => {
    const close = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className={`relative ${containerClassName} ${disabled && 'opacity-60' }`} ref={containerRef}>
      {label && (
        <label className="block text-[14px] font-semibold text-slate-700 mb-1 ml-1">
          {label} {!required && <span className="text-slate-400 font-normal">(optional)</span>}
        </label>
      )}

      <button
        type="button"
        ref={ref}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 bg-white border-2 rounded-xl
          text-left transition-all duration-200 flex items-center justify-between
          focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600
          disabled:cursor-not-allowed
          ${isOpen ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200'}
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
      >
        <span className={`font-medium ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>
          {selectedOption?.label || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selectedOption && !disabled && allowClear && (
            <X size={16} className="text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); onChange?.(''); }} />
          )}
          <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
        </div>
      </button>

      {/* Animation Logic Start */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[60] w-full mt-2 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden p-1 pb-0 origin-top"
          >
            {searchable && (
              <div className="p-3 rounded-xl bg-slate-200/40">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    autoFocus
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className={`${maxHeight} overflow-y-auto p-1.5`}>
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-400 font-medium">{emptyMessage}</div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange?.(opt.value); setIsOpen(false); setSearchQuery(''); }}
                    className={`
                      w-full px-4 py-2.5 mb-1 text-left text-sm font-medium rounded-xl flex items-center justify-between transition-all
                      ${opt.value === value ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}
                    `}
                  >
                    {opt.label}
                    {opt.value === value && <Check size={16} />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Animation Logic End */}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;