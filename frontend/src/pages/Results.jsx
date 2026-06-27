import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import BestModelCard from '../components/results/BestModelCard';
import Charts from '../components/results/Charts';
import ComparisonTable from '../components/results/ComparisonTable';
import DownloadSection from '../components/results/DownloadSection';
import FeatureImportance from '../components/results/FeatureImportance';
import MetricsCards from '../components/results/MetricsCards';
import RecommendationCard from '../components/results/RecommendationCard';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { requestTraining } from '../services/nexmlApi';

const metrics = [
  { label: 'Accuracy', value: '96.4%' },
  { label: 'Precision', value: '95.8%' },
  { label: 'Recall', value: '94.9%' },
  { label: 'F1 Score', value: '95.3%' },
  { label: 'ROC-AUC', value: '97.1%' },
  { label: 'Training Time', value: '04:12' },
  { label: 'Prediction Speed', value: '18 ms' },
];

const models = [
  { model: 'Random Forest', accuracy: 96.4, precision: 95.8, recall: 94.9, f1: 95.3, time: '04:12', status: 'Best' },
  { model: 'XGBoost', accuracy: 95.1, precision: 94.2, recall: 93.8, f1: 94.0, time: '05:03', status: 'Strong' },
  { model: 'SVM', accuracy: 91.7, precision: 91.0, recall: 90.4, f1: 90.7, time: '02:41', status: 'Good' },
  { model: 'Logistic Regression', accuracy: 88.2, precision: 87.5, recall: 86.8, f1: 87.1, time: '01:22', status: 'Baseline' },
  { model: 'Decision Tree', accuracy: 84.6, precision: 83.9, recall: 82.1, f1: 82.9, time: '01:10', status: 'Baseline' },
  { model: 'KNN', accuracy: 82.4, precision: 81.3, recall: 80.1, f1: 80.7, time: '00:58', status: 'Baseline' },
];

function Results() {
  const [backendResults, setBackendResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast, showToast } = useToast();

  const loadResults = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await requestTraining();
      setBackendResults(response.data);
      showToast('Results data loaded from backend.', 'success');
    } catch (error) {
      setBackendResults(null);
      setErrorMessage(error?.response?.data?.message || 'Unable to load results dashboard.');
      showToast('Results request failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const metricsToRender = backendResults
    ? [
        { label: 'Accuracy', value: `${backendResults.metrics.accuracy}%` },
        { label: 'Precision', value: `${backendResults.metrics.precision}%` },
        { label: 'Recall', value: `${backendResults.metrics.recall}%` },
        { label: 'F1 Score', value: `${backendResults.metrics.f1_score}%` },
        { label: 'ROC-AUC', value: `${backendResults.metrics.roc_auc}%` },
        { label: 'Training Time', value: backendResults.metrics.training_time },
        { label: 'Prediction Speed', value: backendResults.metrics.prediction_speed },
      ]
    : metrics;

  const modelsToRender = backendResults
    ? models.map((model) => ({
        ...model,
        status: model.model === backendResults.best_model ? 'Best' : model.status,
      }))
    : models;

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
            Your dataset has been analyzed and the best model has been selected.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {errorMessage ? <ErrorState message={errorMessage} onRetry={loadResults} /> : null}
          {loading ? <LoadingSpinner label="Loading training results..." /> : null}

          <BestModelCard />
          <MetricsCards items={metricsToRender} />
          <ComparisonTable rows={modelsToRender} />
          <Charts />
          <FeatureImportance />
          <RecommendationCard />
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