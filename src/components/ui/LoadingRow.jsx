export default function LoadingRow({ colSpan = 1, rows = 14 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td colSpan={colSpan} className="px-6 py-3.5">
            <div className="h-5 bg-slate-200 rounded-md w-full" />
          </td>
        </tr>
      ))}
    </>
  );
}
