function TrainingStages({ stages, currentStageIndex }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Current Stage</h2>
      <p className="mt-1 text-sm text-slate-500">Stages advance automatically as training progresses.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stages.map((stage, index) => {
          const status =
            index < currentStageIndex ? 'completed' : index === currentStageIndex ? 'active' : 'pending';

          return (
            <div
              key={stage}
              className={`rounded-2xl border p-4 transition-all ${
                status === 'active'
                  ? 'border-indigo-200 bg-indigo-50 shadow-sm'
                  : status === 'completed'
                    ? 'border-emerald-200 bg-emerald-50/80'
                    : 'border-slate-200 bg-slate-50'
              }`}
            >
              <p className="text-sm font-semibold text-slate-950">{stage}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrainingStages;