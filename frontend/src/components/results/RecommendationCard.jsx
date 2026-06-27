import { FiStar } from 'react-icons/fi';

function RecommendationCard() {
  return (
    <div className="rounded-[1.75rem] border border-indigo-100 bg-gradient-to-r from-indigo-50 to-slate-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white">
          <FiStar />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-950">AI Recommendation</h2>
          <p className="text-sm text-slate-500">Suggested deployment choice from the dummy evaluation.</p>
        </div>
      </div>

      <p className="mt-5 max-w-4xl text-base leading-8 text-slate-700">
        Random Forest achieved the highest accuracy while maintaining good precision and recall. It
        is recommended for deployment.
      </p>
    </div>
  );
}

export default RecommendationCard;