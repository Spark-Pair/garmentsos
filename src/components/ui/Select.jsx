import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

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
  const searchInputRef = useRef(null);

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
          {label} {!required && <span>(optional)</span>}
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
          focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600
          disabled:cursor-not-allowed
          ${isOpen ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-200'}
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
          <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-[60] w-full mt-2 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1 pb-0">
          {searchable && (
            <div className="p-3 rounded-xl bg-slate-200/40">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
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
                    ${opt.value === value ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  {opt.label}
                  {opt.value === value && <Check size={16} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;