const toneMap = ['from-indigo-600 to-blue-500', 'from-blue-600 to-cyan-500', 'from-slate-900 to-slate-700'];

function MetricsCards({ items }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-1"
        >
          <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${toneMap[index % toneMap.length]}`} />
          <p className="mt-5 text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export default MetricsCards;