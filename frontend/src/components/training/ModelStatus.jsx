function ModelStatus({ modelCards }) {
  const badgeTone = {
    active: 'bg-indigo-50 text-indigo-600',
    waiting: 'bg-slate-100 text-slate-600',
    done: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Currently Training</h2>
      <div className="mt-6 space-y-4">
        {modelCards.map((model) => (
          <div key={model.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">{model.name}</p>
                <p className="mt-1 text-xs text-slate-500">Next: {model.next}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeTone[model.tone]}`}>
                {model.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelStatus;