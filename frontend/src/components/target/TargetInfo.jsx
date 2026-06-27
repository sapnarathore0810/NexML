import { motion } from 'framer-motion';
import { FiBarChart2, FiAlertCircle, FiHelpCircle } from 'react-icons/fi';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const distributionColors = ['#4f46e5', '#60a5fa', '#c7d2fe'];

function TargetInfo({ column }) {
  const distributionData = [
    { name: 'Class A', value: column.problem === 'classification' ? 58 : 42 },
    { name: 'Class B', value: column.problem === 'classification' ? 27 : 33 },
    { name: 'Class C', value: column.problem === 'classification' ? 15 : 25 },
  ];

  return (
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">
            <FiHelpCircle />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Selected Target</h2>
            <p className="text-sm text-slate-500">A quick summary of the current prediction target.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoItem label="Target Column" value={column.name} />
          <InfoItem label="Data Type" value={column.type} />
          <InfoItem label="Unique Values" value={String(column.uniqueValues)} />
          <InfoItem label="Missing Values" value={`${column.missingValues} rows`} />
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          {column.problem === 'classification'
            ? `${column.name} is being treated as a classification target because it contains discrete values and can be predicted as categories.`
            : `${column.name} is being treated as a regression target because it contains numeric values and can be predicted as a continuous output.`}
        </div>

        <div className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          {column.problem === 'classification' ? '🟢 Classification' : '🔵 Regression'}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">
            <FiBarChart2 />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Target Distribution</h2>
            <p className="text-sm text-slate-500">Dummy visualisation of how the target values are spread.</p>
          </div>
        </div>

        <div className="mt-6 h-72 rounded-[1.5rem] bg-slate-50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={distributionData} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={4}>
                {distributionData.map((entry, index) => (
                  <Cell key={entry.name} fill={distributionColors[index % distributionColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default TargetInfo;