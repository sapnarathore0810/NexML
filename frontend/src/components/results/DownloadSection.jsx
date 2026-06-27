const downloadItems = [
  'Download Model (.pkl)',
  'Download Predictions (.csv)',
  'Download Metrics (.json)',
  'Download Training Report (.pdf)',
];

function DownloadSection() {
  const handlePlaceholderAction = (label) => {
    window.alert(`${label} is a placeholder action in this frontend-only step.`);
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Download Section</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {downloadItems.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handlePlaceholderAction(item)}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-5 text-left text-sm font-semibold text-slate-700 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DownloadSection;