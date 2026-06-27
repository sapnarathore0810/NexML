function UploadProgress({ progress, isComplete }) {
  const blocks = 10;
  const filledBlocks = Math.round((progress / 100) * blocks);

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Upload Progress</h3>
          <p className="mt-1 text-sm text-slate-600">
            {isComplete ? 'Upload complete' : 'Uploading...'}
          </p>
        </div>
        <span className="text-sm font-semibold text-indigo-600">{progress}%</span>
      </div>

      <div className="mt-5 overflow-hidden rounded-full bg-slate-100 p-1">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 font-mono text-sm tracking-[0.25em] text-emerald-400">
        {'█'.repeat(filledBlocks)}{'░'.repeat(blocks - filledBlocks)}
      </div>
    </div>
  );
}

export default UploadProgress;