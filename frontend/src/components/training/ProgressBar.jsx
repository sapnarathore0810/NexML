function ProgressBar({ progress }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Overall Progress</h2>
          <p className="mt-1 text-sm text-slate-500">Live simulation of the training pipeline.</p>
        </div>
        <span className="text-sm font-semibold text-indigo-600">{progress}%</span>
      </div>

      <div className="mt-5 overflow-hidden rounded-full bg-slate-100 p-1">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;