import { FiCheckCircle, FiTrendingUp, FiTarget, FiShuffle } from 'react-icons/fi';

const insightIcons = [FiCheckCircle, FiTrendingUp, FiTarget, FiShuffle];

function Insights({ items }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-indigo-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Quick Insights</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => {
          const Icon = insightIcons[index] || FiCheckCircle;

          return (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Icon />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">{item}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Insights;