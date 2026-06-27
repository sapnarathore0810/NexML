function FeatureList({ columns, selectedTarget }) {
  const featureColumns = columns.filter((column) => column.name !== selectedTarget);

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Feature List</h2>
      <p className="mt-1 text-sm text-slate-500">The selected target is highlighted separately.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {columns.map((column) => (
          <div
            key={column.name}
            className={`rounded-2xl border p-4 transition-all ${
              column.name === selectedTarget
                ? 'border-indigo-200 bg-indigo-50 shadow-sm'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <p className="text-sm font-semibold text-slate-950">{column.name}</p>
            <p className="mt-1 text-sm text-slate-500">{column.type}</p>
            {column.name === selectedTarget ? (
              <span className="mt-3 inline-flex rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                Selected Target
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Remaining features: {featureColumns.map((column) => column.name).join(', ')}
      </div>
    </div>
  );
}

export default FeatureList;