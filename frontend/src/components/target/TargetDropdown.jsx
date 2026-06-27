import { FiChevronDown, FiSearch } from 'react-icons/fi';

function TargetDropdown({ value, onChange, options, selectedTarget, onSelect }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
      <h2 className="text-xl font-semibold text-slate-950">Target Selection</h2>
      <p className="mt-1 text-sm text-slate-500">Search and choose the column to predict.</p>

      <div className="relative mt-5">
        <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search columns..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
        />
      </div>

      <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
        {options.map((option) => (
          <button
            key={option.name}
            type="button"
            onClick={() => onSelect(option.name)}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all hover:-translate-y-0.5 ${
              selectedTarget === option.name
                ? 'border-indigo-200 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <p className="font-medium text-slate-950">{option.name}</p>
              <p className="text-xs text-slate-500">{option.type}</p>
            </div>
            <FiChevronDown className="text-slate-400" />
          </button>
        ))}

        {options.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No matching columns found.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default TargetDropdown;