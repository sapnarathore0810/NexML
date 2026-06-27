import { useState } from 'react';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { requestPrediction } from '../services/nexmlApi';

function Predict() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast, showToast } = useToast();

  const handlePredict = async () => {
    if (!file) {
      setErrorMessage('Please upload a CSV file for prediction.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await requestPrediction(file);
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
            <h2 className="text-xl font-semibold text-slate-950">Upload Prediction CSV</h2>

            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition-all hover:border-indigo-300 hover:bg-indigo-50">
                <FiUpload className="text-2xl text-indigo-600" />
                <span className="mt-4 text-sm font-semibold text-slate-950">
                  Click to upload a CSV for prediction
                </span>
                <span className="mt-2 text-xs text-slate-500">The saved model will preprocess it automatically.</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </label>

              {file ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  Selected file: <span className="font-semibold text-slate-950">{file.name}</span>
                </div>
              ) : null}
            </div>

            {errorMessage ? <div className="mt-6"><ErrorState message={errorMessage} onRetry={handlePredict} /></div> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handlePredict}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? (
                  <LoadingSpinner label="Predicting..." />
                ) : (
                  <>
                    Run Prediction
                  </>
                )}
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
                {prediction?.prediction_summary
                  ? JSON.stringify(prediction.prediction_summary)
                  : 'Awaiting prediction'}
              </p>
            </div>
            <div className="mt-4 rounded-[1.5rem] bg-indigo-50 p-5 text-sm leading-7 text-slate-700">
              {prediction
                ? `Generated ${prediction.total_records} predictions from the uploaded CSV.`
                : 'Click Run Prediction to send the uploaded CSV to the FastAPI /predict endpoint.'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Predict;