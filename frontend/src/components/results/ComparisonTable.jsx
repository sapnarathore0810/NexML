function ComparisonTable({ rows }) {
  const columns = rows.length
    ? ['model', ...Object.keys(rows[0]).filter((key) => key !== 'model')]
    : [];

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }

    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }

    return String(value);
  };

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-semibold text-slate-950">Model Comparison Table</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-slate-950 text-white">
            <tr>
              {columns.map((heading) => (
                <th key={heading} className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold">
                  {heading === 'model'
                    ? 'Model'
                    : heading
                        .replace(/_/g, ' ')
                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                        .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.model} className={row.status === 'Best' ? 'bg-indigo-50' : index % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                {columns.map((column) => (
                  <td
                    key={column}
                    className="whitespace-nowrap border-t border-slate-200 px-6 py-4 text-sm text-slate-700"
                  >
                    {column === 'model' ? (
                      <span className="font-semibold text-slate-950">{row[column]}</span>
                    ) : (
                      renderValue(row[column])
                    )}
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

export default ComparisonTable;