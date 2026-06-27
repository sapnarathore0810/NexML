import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function CTA() {
  return (
    <section id="cta" className="bg-slate-50 px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 px-6 py-14 text-center shadow-[0_24px_90px_rgba(15,23,42,0.18)] sm:px-12 lg:px-20"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-200">
          Get Started
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Build Smarter Models?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Start your next machine learning workflow with a cleaner process, faster decisions, and a
          polished experience from the first upload.
        </p>
        <div className="mt-8">
          <Link
            to="/#hero"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-base font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
          >
            Get Started
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default CTA;