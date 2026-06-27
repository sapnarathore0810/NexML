function ActivityLog({ logs }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Activity Log</h2>
      <p className="mt-1 text-sm text-slate-500">A live log of the training pipeline.</p>

      <div className="mt-6 max-h-80 space-y-3 overflow-y-auto pr-1">
        {logs.map((log, index) => (
          <div key={`${log.entry}-${index}`} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{log.entry}</p>
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              {log.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityLog;