import { FiDatabase, FiGrid, FiLayers, FiPieChart, FiType, FiUpload } from 'react-icons/fi';

const iconMap = {
  Rows: FiDatabase,
  Columns: FiGrid,
  'Missing Values': FiLayers,
  'Categorical Columns': FiType,
  'Numerical Columns': FiPieChart,
  'Dataset Size': FiUpload,
};

function SummaryCards({ items }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = iconMap[item.label] || FiDatabase;

        return (
          <div
            key={item.label}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                <Icon />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryCards;