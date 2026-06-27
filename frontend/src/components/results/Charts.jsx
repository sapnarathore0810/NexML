import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const accuracyData = [
  { name: 'Random Forest', value: 96.4 },
  { name: 'XGBoost', value: 95.1 },
  { name: 'SVM', value: 91.7 },
  { name: 'Logistic Regression', value: 88.2 },
];

const confusionMatrixData = [
  { name: 'TP', value: 86 },
  { name: 'FP', value: 9 },
  { name: 'FN', value: 6 },
  { name: 'TN', value: 89 },
];

const rocData = [
  { x: 0, y: 0 },
  { x: 0.15, y: 0.52 },
  { x: 0.28, y: 0.71 },
  { x: 0.42, y: 0.82 },
  { x: 0.58, y: 0.9 },
  { x: 0.74, y: 0.95 },
  { x: 1, y: 1 },
];

const trainingTimeData = [
  { name: 'Random Forest', value: 4.2 },
  { name: 'XGBoost', value: 5.0 },
  { name: 'SVM', value: 2.7 },
  { name: 'Logistic Regression', value: 1.2 },
];

function Charts() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard title="Model Accuracy Comparison">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-10} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Confusion Matrix">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={confusionMatrixData} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={4}>
              {confusionMatrixData.map((entry, index) => (
                <Cell key={entry.name} fill={['#4f46e5', '#60a5fa', '#818cf8', '#c7d2fe'][index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ROC Curve">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rocData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="x" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Training Time Comparison">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trainingTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-10} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#0f172a" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-6 h-80 rounded-[1.5rem] bg-slate-50 p-4">{children}</div>
    </div>
  );
}

export default Charts;