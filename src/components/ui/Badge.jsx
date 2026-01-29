import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-slate-100/70 text-slate-700 border-slate-300',
    success: 'bg-emerald-100/70 text-emerald-700 border-emerald-300',
    warning: 'bg-amber-100/70 text-amber-700 border-amber-300',
    info: 'bg-blue-100/70 text-blue-700 border-blue-300',
    danger: 'bg-red-100/70 text-red-700 border-red-300',
    dark: 'bg-slate-900 text-white border-slate-800',
  };

  const sizes = {
    // Small (Aapka current size - for table rows/tags)
    sm: 'px-2.5 py-0.5 text-[11px] tracking-wide rounded-lg',
    // Medium (Thora bara - for headers/summary blocks)
    md: 'px-3.5 py-1.5 text-[12.5px] tracking-wider rounded-xl',
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