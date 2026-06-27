import { FiAward } from 'react-icons/fi';

function BestModelCard() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 p-8 text-white shadow-[0_24px_90px_rgba(15,23,42,0.18)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-indigo-100 backdrop-blur">
            <FiAward className="mr-2" />
            Best Model
          </div>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Random Forest</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Random Forest achieved the strongest balance of accuracy, precision, and recall across
            the evaluated models.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 px-6 py-5 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.22em] text-indigo-100">Accuracy</p>
          <p className="mt-3 text-5xl font-semibold">96.4%</p>
        </div>
      </div>
    </div>
  );
}

export default BestModelCard;