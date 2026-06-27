import { useEffect, useMemo, useState } from 'react';
import { FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ActivityLog from '../components/training/ActivityLog';
import ModelStatus from '../components/training/ModelStatus';
import ProgressBar from '../components/training/ProgressBar';
import StatisticsCards from '../components/training/StatisticsCards';
import TrainingStages from '../components/training/TrainingStages';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { requestTraining } from '../services/nexmlApi';

const stages = [
  'Reading Dataset',
  'Cleaning Data',
  'Handling Missing Values',
  'Encoding Features',
  'Scaling Data',
  'Training Models',
  'Evaluating Models',
  'Selecting Best Model',
  'Saving Model',
];

const initialLogs = [
  'Dataset Loaded',
  'Missing Values Filled',
  'Random Forest Finished',
  'Training XGBoost',
  'Selecting Best Model',
];

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function Training() {
  const [progress, setProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [logs, setLogs] = useState(
    initialLogs.map((entry, index) => ({
      entry,
      time: `10:${(12 + index).toString().padStart(2, '0')} AM`,
    })),
  );
  const [isCancelled, setIsCancelled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast, showToast } = useToast();

  const initializeTraining = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      await requestTraining();
      showToast('Training endpoint reached successfully.', 'success');
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to start training request.');
      showToast('Training setup failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCancelled) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setProgress((currentProgress) => {
        const nextProgress = Math.min(currentProgress + 1, 100);
        const nextStageIndex = Math.min(Math.floor(nextProgress / 12), stages.length - 1);

        setCurrentStageIndex(nextStageIndex);

        const stage = stages[nextStageIndex];

        setLogs((currentLogs) => [
          {
            entry: `Processing ${stage}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...currentLogs,
        ]);

        return nextProgress;
      });
      setElapsedSeconds((seconds) => seconds + 1);
    }, 220);

    return () => window.clearInterval(interval);
  }, [isCancelled]);

  useEffect(() => {
    initializeTraining();
  }, []);

  const statistics = useMemo(
    () => [
      { label: 'Elapsed Time', value: formatTime(elapsedSeconds) },
      { label: 'Estimated Time Remaining', value: formatTime(Math.max(100 - progress, 0)) },
      { label: 'Models Completed', value: String(Math.min(Math.floor(progress / 30), 3)) },
      { label: 'Models Remaining', value: String(Math.max(3 - Math.floor(progress / 30), 0)) },
    ],
    [elapsedSeconds, progress],
  );

  const modelCards = [
    { name: 'Random Forest', status: 'Training...', tone: 'active', next: 'XGBoost' },
    { name: 'XGBoost', status: 'Waiting', tone: 'waiting', next: 'SVM' },
    { name: 'SVM', status: 'Completed', tone: 'done', next: 'Done' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm">
        <Toast message={toast.message} tone={toast.tone} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Training Models
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Training Models
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            NexML is automatically preprocessing your data and evaluating multiple machine learning
            models.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {errorMessage ? <ErrorState message={errorMessage} onRetry={initializeTraining} /> : null}
          {loading ? <LoadingSpinner label="Initializing training..." /> : null}

          <ProgressBar progress={progress} />

          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <TrainingStages stages={stages} currentStageIndex={currentStageIndex} />
              <ActivityLog logs={logs} />
            </div>

            <div className="space-y-8">
              <ModelStatus modelCards={modelCards} />
              <StatisticsCards statistics={statistics} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center rounded-full bg-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-600 opacity-70"
            >
              Training In Progress
            </button>
            <button
              type="button"
              onClick={() => setIsCancelled(true)}
              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-6 py-3.5 text-sm font-semibold text-rose-600 transition-all hover:-translate-y-0.5 hover:bg-rose-50"
            >
              <FiX className="mr-2" />
              Cancel Training
            </button>
            <Link
              to="/results"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              View Results <FiArrowRight className="ml-2" />
            </Link>
          </div>

          <div>
            <Link
              to="/target-selection"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Training;