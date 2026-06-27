function DatasetTable({ rows }) {
  const columns = rows.length > 0 ? Object.keys(rows[0]).filter((column) => column !== 'id') : [];

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-semibold text-slate-950">Dataset Table</h2>
        <p className="mt-1 text-sm text-slate-600">First 10 rows of the uploaded CSV</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-slate-950 text-white">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}
              >
                {columns.map((column) => (
                  <td
                    key={`${row.id}-${column}`}
                    className="whitespace-nowrap border-t border-slate-200 px-6 py-4 text-sm text-slate-700"
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DatasetTable;