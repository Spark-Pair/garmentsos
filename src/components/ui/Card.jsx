import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white border border-slate-200 rounded-xl shadow-sm
        ${paddings[padding]}
        ${hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-500 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-slate-100 ${className}`}>
    {children}
  </div>
);

// --- MetricTile: For Big Numbers ---
export const MetricTile = ({ label, value, icon: Icon, variant = "default" }) => {
  const styles = {
    default: "bg-white border-slate-300 text-slate-900",
    success: "bg-emerald-100 border-emerald-300 text-emerald-800",
    warning: "bg-amber-100 border-amber-300 text-amber-800",
    info: "bg-indigo-100 border-indigo-300 text-indigo-800",
  };
  
  return (
    <div className={`p-6 rounded-3xl border transition-all ${styles[variant]}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">{label}</span>
        {Icon && <Icon size={18} className="opacity-50" />}
      </div>
      <p className="text-2xl font-bold font-mono">
        {typeof value === 'number' ? `Rs. ${value.toLocaleString()}` : value}
      </p>
    </div>
  );
};

// --- InfoRow: For Sidebar Details ---
export const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-300 last:border-0 last:pb-0 first:pt-0">
    <div className="mt-0 p-2.5 bg-slate-500 rounded-xl text-slate-50">
      <Icon size={20} />
    </div>
    <div className='flex flex-col'>
      <p className="text-[10.5px] font-bold uppercase text-slate-500 leading-none mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-700  leading-none">{value || "---"}</p>
    </div>
  </div>
);

export default Card;
