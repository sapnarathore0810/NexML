import { motion } from 'framer-motion';
import { FiArrowDown, FiFileText, FiTarget, FiCpu, FiDownload } from 'react-icons/fi';

const steps = [
  {
    icon: FiFileText,
    title: 'Upload CSV',
    description: 'Add your dataset and let NexML inspect the structure immediately.',
  },
  {
    icon: FiTarget,
    title: 'Select Target',
    description: 'Choose the field you want to predict and define the machine learning goal.',
  },
  {
    icon: FiCpu,
    title: 'Train Models',
    description: 'Automatically run multiple models and compare their validation results.',
  },
  {
    icon: FiDownload,
    title: 'Download Best Model',
    description: 'Export the winning model package and move it into your next stage.',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            How It Works
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            A simple flow from raw data to the best model
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="relative"
              >
                <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white shadow-lg shadow-slate-950/10">
                    <Icon />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                      0{index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
                  </div>
                  <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
                </div>

                {index < steps.length - 1 ? (
                  <div className="mt-4 hidden justify-center text-slate-300 lg:flex">
                    <FiArrowDown className="h-6 w-6 rotate-[-90deg]" />
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;