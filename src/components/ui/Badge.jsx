import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    dark: 'bg-slate-900 text-white border-slate-800',
  };

  const sizes = {
    // Small (Aapka current size - for table rows/tags)
    sm: 'px-2.5 py-0.5 text-[10px] tracking-wide rounded-lg',
    // Medium (Thora bara - for headers/summary blocks)
    md: 'px-4 py-1.5 text-[12px] tracking-widest rounded-xl shadow-sm',
  };

  return (
    <span className={`
      inline-flex items-center font-black uppercase border transition-all
      ${variants[variant] || variants.default}
      ${sizes[size] || sizes.sm}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;