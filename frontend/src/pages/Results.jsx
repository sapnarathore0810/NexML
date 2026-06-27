import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import BestModelCard from '../components/results/BestModelCard';
import ComparisonTable from '../components/results/ComparisonTable';
import DownloadSection from '../components/results/DownloadSection';
import MetricsCards from '../components/results/MetricsCards';
import RecommendationCard from '../components/results/RecommendationCard';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
const metrics = [
  { label: 'Accuracy', value: '—' },
  { label: 'Precision', value: '—' },
  { label: 'Recall', value: '—' },
  { label: 'F1 Score', value: '—' },
  { label: 'ROC-AUC', value: '—' },
  { label: 'Training Time', value: '—' },
  { label: 'Prediction Time', value: '—' },
];

function Results() {
  const location = useLocation();
  const [backendResults, setBackendResults] = useState(() => {
    if (location.state) {
      return location.state;
    }

    const cached = window.sessionStorage.getItem('nexml-training-results');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (location.state) {
      setBackendResults(location.state);
      window.sessionStorage.setItem('nexml-training-results', JSON.stringify(location.state));
      showToast('Results loaded successfully.', 'success');
      return;
    }

    if (!backendResults) {
      setErrorMessage('No training results were found. Please run training first.');
      return;
    }

    showToast('Results loaded successfully.', 'success');
  }, [backendResults, location.state, showToast]);

  const metricsToRender = backendResults
    ? [
        { label: 'Accuracy', value: `${backendResults.best_metrics?.accuracy ?? backendResults.best_metrics?.r2_score ?? '—'}%` },
        { label: 'Precision', value: `${backendResults.best_metrics?.precision ?? '—'}%` },
        { label: 'Recall', value: `${backendResults.best_metrics?.recall ?? '—'}%` },
        { label: 'F1 Score', value: `${backendResults.best_metrics?.f1_score ?? '—'}%` },
        { label: 'ROC-AUC', value: `${backendResults.best_metrics?.roc_auc ?? '—'}%` },
        { label: 'Training Time', value: `${backendResults.training_time ?? '—'} s` },
        { label: 'Prediction Time', value: `${backendResults.prediction_time ?? '—'} s` },
      ]
    : metrics;

  const modelsToRender = backendResults
    ? backendResults.comparison_table || []
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm">
        <Toast message={toast.message} tone={toast.tone} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Results Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Training Results
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {backendResults
              ? `Your dataset has been analyzed and ${backendResults.best_model} was selected as the best model.`
              : 'Your dataset has been analyzed and the best model has been selected.'}
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {errorMessage ? <ErrorState message={errorMessage} /> : null}
          {loading ? <LoadingSpinner label="Loading training results..." /> : null}

          <BestModelCard
            modelName={backendResults?.best_model || 'Random Forest'}
            metricLabel={backendResults?.problem_type === 'regression' ? 'R2 Score' : 'Accuracy'}
            metricValue={
              backendResults
                ? backendResults.problem_type === 'regression'
                  ? `${backendResults.best_metrics?.r2_score ?? '—'}%`
                  : `${backendResults.best_metrics?.accuracy ?? '—'}%`
                : '96.4%'
            }
            reason={backendResults?.best_reason || 'Random Forest achieved the strongest balance of accuracy, precision, and recall across the evaluated models.'}
          />
          <MetricsCards items={metricsToRender} />
          <ComparisonTable rows={modelsToRender} />
          <RecommendationCard text={backendResults?.recommendation || 'Random Forest achieved the highest accuracy while maintaining good precision and recall. It is recommended for deployment.'} />
          <DownloadSection />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/training"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950"
            >
              <FiArrowLeft className="mr-2" />
              Train Another Dataset
            </Link>
            <Link
              to="/predict"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              Go to Prediction Page <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Results;