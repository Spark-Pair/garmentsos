import React from 'react';

const Table = ({ children, className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full">
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-slate-50 border-b border-slate-200">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-slate-100">
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', onClick, hover = true }) => (
  <tr 
    className={`
      ${hover ? 'hover:bg-slate-50' : ''} 
      ${onClick ? 'cursor-pointer' : ''}
      transition-colors
      ${className}
    `}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className = '', align = 'left' }) => (
  <th className={`
    px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider
    text-${align}
    ${className}
  `}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '', align = 'left' }) => (
  <td className={`px-4 py-3 text-sm text-${align} ${className}`}>
    {children}
  </td>
);

export default Table;
