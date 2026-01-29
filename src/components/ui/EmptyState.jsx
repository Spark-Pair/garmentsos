import { Plus, SearchX, DatabaseBackup } from "lucide-react";

export default function EmptyState({ 
  colSpan, 
  onReset, 
  isFiltering = true, // Default true taake reset button dikhe
  title, 
  message 
}) {
  // Universal Messages
  const displayTitle = title || (isFiltering ? "No matches found" : "No records yet");
  const displayMessage = message || (isFiltering 
    ? "We couldn't find anything matching your filters." 
    : "Get started by adding your first record to the system.");

  return (
    <tr>
      <td colSpan={colSpan} className="py-24 text-center">
        <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          
          {/* Dynamic Icon */}
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
            {isFiltering ? <SearchX size={32} /> : <DatabaseBackup size={32} />}
          </div>
          
          <h3 className="text-slate-800 text-xl font-semibold mb-2">
            {displayTitle}
          </h3>
          
          <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
            {displayMessage}
          </p>

          {isFiltering && onReset && (
            <button 
              onClick={onReset}
              className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}