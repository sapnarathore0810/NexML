const features = [
  { name: 'Age', value: 92 },
  { name: 'Salary', value: 84 },
  { name: 'Experience', value: 76 },
  { name: 'Education', value: 68 },
  { name: 'BMI', value: 55 },
];

function FeatureImportance() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Feature Importance</h2>
      <div className="mt-6 space-y-4">
        {features.map((feature) => (
          <div key={feature.name}>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>{feature.name}</span>
              <span>{feature.value}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500"
                style={{ width: `${feature.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeatureImportance;