import { ChevronUp, ChevronDown } from "lucide-react";

export default function DataTableHeader({ columns, sort, onSort }) {
  return (
    <thead className="sticky top-0 z-10 bg-slate-200 border-b border-slate-300">
      <tr>
        {columns.map((col) => {
          const isActive = sort.sortBy === col.key;
          
          // Alignment classes mapping
          const alignmentClass = 
            col.align === 'center' ? "text-center justify-center" : 
            col.align === 'right' ? "text-right justify-end" : 
            "text-left justify-start";

          return (
            <th
              key={col.key}
              onClick={() => col.sortable && onSort(col.key)}
              className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 
                ${col.sortable ? "cursor-pointer hover:text-blue-600 transition-colors select-none" : ""} 
                ${alignmentClass}`} // text-center yahan apply hoga
            >
              {/* flex container mein alignmentClass pass ki hai justify handle karne ke liye */}
              <div className={`flex items-center gap-1.5 ${alignmentClass}`}>
                {col.label}
                {col.sortable && (
                  <div className="flex flex-col opacity-60">
                    <ChevronUp size={10} className={isActive && sort.order === 'asc' ? 'text-blue-600 opacity-100' : ''} />
                    <ChevronDown size={10} className={isActive && sort.order === 'desc' ? 'text-blue-600 opacity-100' : ''} />
                  </div>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}