import { ChevronLeft, ChevronRight } from "lucide-react";

export function DataTablePagination({ pagination, onPageChange }) {
  const { page, totalPages, limit, total } = pagination;

  // Handle Input Change
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Sirf numbers allow karne ke liye
    if (value === "") {
      onPageChange(""); // User ko clear karne ki ijazat dein
      return;
    }

    const num = parseInt(value);
    if (!isNaN(num)) {
      // Logic: 1 se chota na ho aur totalPages se bara na ho
      const validatedPage = Math.max(1, Math.min(num, totalPages));
      onPageChange(validatedPage);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Page Navigation */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl border border-slate-300 p-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center gap-2 px-2 text-sm text-slate-500 font-medium">
          <span className="text-xs uppercase tracking-tight leading-none opacity-80">Page</span>
          <input 
            type="number" 
            value={page}
            min={1}
            max={totalPages}
            onChange={handleInputChange}
            onClick={(e) => {e.target.select()}}
            className="w-12 h-8 text-center border border-slate-200 rounded-lg bg-white text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
          />
          <span className="text-xs uppercase tracking-tight leading-none opacity-80">of {totalPages || 0}</span>
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Rows per page text */}
      <div className="text-[11px] uppercase tracking-widest font-black text-slate-400 leading-none">
        <p>Limit: <span className="text-slate-600">{limit}</span></p>
        <p className="font-medium normal-case text-slate-400">
          Showing <span className="text-slate-900 font-bold">{(total === 0 ? 0 : (page - 1) * limit + 1)}-{Math.min(page * limit, total)}</span> of {total}
        </p>
      </div>
    </div>
  );
}