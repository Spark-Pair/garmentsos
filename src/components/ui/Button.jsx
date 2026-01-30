import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-indigo-600 enabled:hover:bg-indigo-700 text-white shadow-sm',
  secondary: 'bg-slate-100 enabled:hover:bg-slate-200 text-slate-700 border border-slate-200',
  dark: 'bg-slate-900 enabled:hover:bg-slate-700 text-slate-100',
  danger: 'bg-red-600 enabled:hover:bg-red-700 text-white shadow-sm',
  success: 'bg-emerald-600 enabled:hover:bg-emerald-700 text-white shadow-sm',
  ghost: 'bg-transparent enabled:hover:bg-slate-100 text-slate-600',
  outline: 'border border-slate-300 enabled:hover:bg-slate-50 text-slate-700',
};

const sizes = {
  xs: 'px-2 py-1 text-xs rounded-lg',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-5 py-2.5 text-base rounded-xl',
  icon: 'p-2',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2 font-medium 
    enabled:hover:scale-[1.038] transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed 
  `;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={16} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={16} />}
    </button>
  );
};

export default Button;
