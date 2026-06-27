import { FiHash } from 'react-icons/fi';

function DataTypes({ items }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Data Types</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <FiHash />
              </span>
              <div>
                <h3 className="font-semibold text-slate-950">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.type}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">Examples: {item.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataTypes;