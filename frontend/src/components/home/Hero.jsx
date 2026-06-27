import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,1),rgba(248,250,252,1))]" />
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
            <FiCheckCircle className="mr-2" />
            Smart AutoML workflow for modern teams
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Build Machine Learning Models in Minutes
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            NexML automatically preprocesses your dataset, trains multiple machine learning models,
            compares their performance, and lets you download the best model without writing a
            single line of code.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/#cta"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              Get Started
              <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to="/#features"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-transform hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              Data preprocessing
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              Model comparison
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              Best model export
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -right-8 bottom-12 h-28 w-28 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-sm text-slate-300">Training Status</p>
                <p className="mt-3 text-3xl font-semibold">98%</p>
                <p className="mt-2 text-sm text-slate-400">Pipeline ready for deployment</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 p-5 text-white">
                <p className="text-sm text-indigo-100">Best Model</p>
                <p className="mt-3 text-3xl font-semibold">XGBoost</p>
                <p className="mt-2 text-sm text-indigo-100/90">Highest validation score</p>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Model comparison</span>
                <span>Accuracy</span>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  ['XGBoost', '92%'],
                  ['Random Forest', '88%'],
                  ['Logistic Regression', '81%'],
                ].map(([name, value]) => (
                  <div key={name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                      <span>{name}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500"
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-2xl font-semibold text-slate-950">1</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Upload</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-2xl font-semibold text-slate-950">2</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Train</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-2xl font-semibold text-slate-950">3</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Export</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;