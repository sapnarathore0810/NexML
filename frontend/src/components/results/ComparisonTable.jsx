function ComparisonTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-semibold text-slate-950">Model Comparison Table</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-slate-950 text-white">
            <tr>
              {['Model', 'Accuracy', 'Precision', 'Recall', 'F1', 'Training Time', 'Status'].map((heading) => (
                <th key={heading} className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.model} className={row.status === 'Best' ? 'bg-indigo-50' : index % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                <td className="whitespace-nowrap border-t border-slate-200 px-6 py-4 text-sm font-semibold text-slate-950">{row.model}</td>
                <td className="whitespace-nowrap border-t border-slate-200 px-6 py-4 text-sm text-slate-700">{row.accuracy}%</td>
                <td className="whitespace-nowrap border-t border-slate-200 px-6 py-4 text-sm text-slate-700">{row.precision}%</td>
                <td className="whitespace-nowrap border-t border-slate-200 px-6 py-4 text-sm text-slate-700">{row.recall}%</td>
                <td className="whitespace-nowrap border-t border-slate-200 px-6 py-4 text-sm text-slate-700">{row.f1}%</td>
                <td className="whitespace-nowrap border-t border-slate-200 px-6 py-4 text-sm text-slate-700">{row.time}</td>
                <td className="whitespace-nowrap border-t border-slate-200 px-6 py-4 text-sm text-slate-700">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComparisonTable;