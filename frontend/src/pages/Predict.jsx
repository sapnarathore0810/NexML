import { useState } from 'react';
import { FiPlay, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { requestPrediction } from '../services/nexmlApi';

const initialFeatures = {
  Age: 29,
  Salary: 72000,
  Gender: 'Male',
  Experience: 5,
};

function Predict() {
  const [features, setFeatures] = useState(initialFeatures);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast, showToast } = useToast();

  const handlePredict = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await requestPrediction(features);
      setPrediction(response.data);
      showToast('Prediction generated successfully.', 'success');
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Prediction request failed.');
      showToast('Prediction failed. Please retry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm">
        <Toast message={toast.message} tone={toast.tone} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Prediction
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Predict Outcomes
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Use the selected model to generate a dummy prediction from sample feature values.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <h2 className="text-xl font-semibold text-slate-950">Sample Feature Input</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Age</span>
                <input
                  type="number"
                  value={features.Age}
                  onChange={(event) => setFeatures({ ...features, Age: Number(event.target.value) })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-300 focus:bg-white"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Salary</span>
                <input
                  type="number"
                  value={features.Salary}
                  onChange={(event) =>
                    setFeatures({ ...features, Salary: Number(event.target.value) })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-300 focus:bg-white"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Gender</span>
                <select
                  value={features.Gender}
                  onChange={(event) => setFeatures({ ...features, Gender: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-300 focus:bg-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Experience</span>
                <input
                  type="number"
                  value={features.Experience}
                  onChange={(event) =>
                    setFeatures({ ...features, Experience: Number(event.target.value) })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-300 focus:bg-white"
                />
              </label>
            </div>

            {errorMessage ? <div className="mt-6"><ErrorState message={errorMessage} onRetry={handlePredict} /></div> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handlePredict}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? <LoadingSpinner label="Predicting..." /> : <>
                  <FiPlay className="mr-2" />
                  Run Prediction
                </>}
              </button>
              <Link
                to="/results"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950"
              >
                <FiArrowLeft className="mr-2" />
                Back to Results
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <h2 className="text-xl font-semibold text-slate-950">Prediction Output</h2>
            <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {prediction?.predicted_value || 'Awaiting prediction'}
              </p>
            </div>
            <div className="mt-4 rounded-[1.5rem] bg-indigo-50 p-5 text-sm leading-7 text-slate-700">
              {prediction
                ? 'This is a backend-generated placeholder response for the current frontend integration step.'
                : 'Click Run Prediction to send the sample features to the FastAPI /predict endpoint.'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Predict;