import { FiAlertCircle } from 'react-icons/fi';

function MissingValues({ items }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Missing Values</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.column} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <FiAlertCircle className="text-indigo-600" />
                {item.column}
              </div>
              <span className="text-slate-500">{item.count} missing</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all"
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">{item.percentage}% of rows</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MissingValues;