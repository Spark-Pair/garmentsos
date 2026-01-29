import React, { forwardRef } from 'react';

const Textarea = forwardRef(({
  label, error, rows = 3, className = '', containerClassName = '',
  required = true, helperText, maxLength, showCount = false, value = '', disabled = false, ...props
}, ref) => {
  const currentLength = value?.length || 0;
  
  return (
    <div className={`${containerClassName} ${disabled && 'opacity-60' }`}>
      {label && (
        <div className="flex items-center justify-between ml-1">
          <label className="block text-[14px] font-semibold text-slate-700 mb-1 ml-1">
            {label} {!required && <span>(optional)</span>}
          </label>
          {showCount && maxLength && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={`
          w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-2xl
          text-slate-900 font-medium placeholder-slate-400
          focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600
          transition-all duration-200
          disabled:cursor-not-allowed
          resize-none
          ${error ? 'border-red-500 focus:ring-red-50' : ''}
          ${className}
        `}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-500 font-bold ml-1">{error}</p>
      ) : helperText && (
        <p className="text-xs text-slate-500 ml-1">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;