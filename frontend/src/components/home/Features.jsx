import { motion } from 'framer-motion';
import {
  FiBarChart2,
  FiDownload,
  FiCpu,
  FiLayers,
  FiRefreshCw,
  FiUploadCloud,
} from 'react-icons/fi';

const features = [
  {
    icon: FiUploadCloud,
    title: 'Upload Dataset',
    description: 'Start with a CSV file and move from raw data to model-ready inputs in seconds.',
  },
  {
    icon: FiRefreshCw,
    title: 'Automatic Data Cleaning',
    description: 'Let NexML handle missing values, encodings, and basic preprocessing steps.',
  },
  {
    icon: FiLayers,
    title: 'Auto Feature Engineering',
    description: 'Generate stronger signals with intelligent feature transformations and selection.',
  },
  {
    icon: FiCpu,
    title: 'Train Multiple Models',
    description: 'Evaluate several algorithms automatically to find the best candidate quickly.',
  },
  {
    icon: FiBarChart2,
    title: 'Interactive Visualizations',
    description: 'Review model performance with clear, decision-friendly summaries and charts.',
  },
  {
    icon: FiDownload,
    title: 'Download Best Model',
    description: 'Export the top-performing model and take it straight into your workflow.',
  },
];

function Features() {
  return (
    <section id="features" className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Features
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Everything you need for a polished AutoML workflow
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            NexML keeps the interface simple while handling the complex parts behind the scenes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-2xl text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
                  <Icon />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;