import { FiCheckCircle, FiDatabase, FiClock } from 'react-icons/fi';

const tips = [
  {
    icon: FiCheckCircle,
    text: 'Upload only CSV files.',
  },
  {
    icon: FiDatabase,
    text: 'Missing values are handled automatically.',
  },
  {
    icon: FiClock,
    text: 'Large datasets may take longer.',
  },
];

function UploadTips() {
  return (
    <div className="mt-6 space-y-3">
      {tips.map((tip) => {
        const Icon = tip.icon;

        return (
          <div
            key={tip.text}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Icon />
            </span>
            <p className="leading-6">{tip.text}</p>
          </div>
        );
      })}
    </div>
  );
}

export default UploadTips;