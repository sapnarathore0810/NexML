import { motion } from 'framer-motion';
import { FiClock, FiCode, FiShield } from 'react-icons/fi';

const reasons = [
  {
    icon: FiClock,
    title: 'Saves Time',
    description: 'Reduce repetitive setup work and move from dataset to decision much faster.',
  },
  {
    icon: FiCode,
    title: 'No Coding Required',
    description: 'Deliver machine learning capabilities through a guided and friendly interface.',
  },
  {
    icon: FiShield,
    title: 'Intelligent Model Selection',
    description: 'Automatically compare candidates and surface the model with the strongest fit.',
  },
];

function WhyChoose() {
  return (
    <section className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Why Choose NexML
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Built for speed, clarity, and confident decisions
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                  <Icon />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{reason.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{reason.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;