import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 font-bold text-white shadow-lg shadow-indigo-500/20">
              N
            </span>
            <span className="text-xl font-semibold tracking-tight text-slate-950">NexML</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            NexML helps teams move from raw data to model-ready insights with a streamlined,
            no-code AutoML experience.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Quick Links
          </h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/#hero" className="transition-colors hover:text-slate-950">
              Home
            </Link>
            <Link to="/#features" className="transition-colors hover:text-slate-950">
              Features
            </Link>
            <Link to="/#how-it-works" className="transition-colors hover:text-slate-950">
              How It Works
            </Link>
            <Link to="/about" className="transition-colors hover:text-slate-950">
              About
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Connect
          </h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-slate-950"
            >
              <FiGithub />
              GitHub Placeholder
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-slate-950"
            >
              <FiLinkedin />
              LinkedIn Placeholder
            </a>
            <a
              href="mailto:hello@nexml.ai"
              className="inline-flex items-center gap-2 transition-colors hover:text-slate-950"
            >
              <FiMail />
              hello@nexml.ai
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
        © 2026 NexML. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;