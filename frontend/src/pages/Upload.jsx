import { useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowRight, FiUploadCloud } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { uploadDataset } from '../services/nexmlApi';
import UploadCard from '../components/upload/UploadCard';
import FileDetails from '../components/upload/FileDetails';
import UploadProgress from '../components/upload/UploadProgress';
import UploadTips from '../components/upload/UploadTips';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';

function Upload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const progressTimerRef = useRef(null);
  const { toast, showToast } = useToast();

  const uploadTime = useMemo(
    () =>
      selectedFile
        ? new Date().toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
          })
        : '',
    [selectedFile],
  );

  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const startFakeProgress = () => {
    clearProgressTimer();
    setProgress(0);

    // Fake upload progress keeps this step frontend-only while still feeling alive.
    progressTimerRef.current = window.setInterval(() => {
      setProgress((current) => {
        const nextValue = current + (current < 60 ? 8 : current < 90 ? 4 : 1);

        if (nextValue >= 100) {
          clearProgressTimer();
          return 100;
        }

        return nextValue;
      });
    }, 120);
  };

  const handleContinue = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a CSV file before continuing.');
      return;
    }

    setErrorMessage('');
    setIsUploading(true);

    try {
      await uploadDataset(selectedFile);
      showToast('Upload sent to backend successfully.', 'success');
      navigate('/preview');
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Upload failed. Please retry.');
      showToast('Upload failed. Please retry.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv';

    if (!isCsv) {
      clearProgressTimer();
      setSelectedFile(null);
      setProgress(0);
      setValidationMessage('Invalid file type');
      return;
    }

    setSelectedFile(file);
    setValidationMessage('File selected successfully');
    startFakeProgress();
  };

  useEffect(() => {
    return () => clearProgressTimer();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm">
        <Toast message={toast.message} tone={toast.tone} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Upload Dataset
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Upload Your Dataset
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Upload a CSV file to begin training machine learning models.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            {errorMessage ? <ErrorState message={errorMessage} onRetry={handleContinue} /> : null}

            <UploadCard
              isDragging={isDragging}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFile(event.dataTransfer.files?.[0]);
              }}
              onFileChange={(event) => handleFile(event.target.files?.[0])}
              validationMessage={validationMessage}
              hasFile={Boolean(selectedFile)}
            />

            {selectedFile ? (
              <FileDetails
                fileName={selectedFile.name}
                fileSize={selectedFile.size}
                uploadTime={uploadTime}
                onRemove={() => {
                  clearProgressTimer();
                  setSelectedFile(null);
                  setValidationMessage('');
                  setProgress(0);
                }}
              />
            ) : null}

            <UploadProgress progress={progress} isComplete={progress === 100 && Boolean(selectedFile)} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedFile || isUploading}
                className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                  selectedFile && !isUploading
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500'
                    : 'cursor-not-allowed bg-slate-200 text-slate-500'
                }`}
              >
                {isUploading ? <LoadingSpinner label="Uploading..." /> : <>
                  Continue <FiArrowRight className="ml-2" />
                </>}
              </button>
              <button
                type="button"
                onClick={() => {
                  clearProgressTimer();
                  setSelectedFile(null);
                  setValidationMessage('');
                  setProgress(0);
                  setErrorMessage('');
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                  <FiUploadCloud />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Upload Tips</h2>
                  <p className="text-sm text-slate-500">Keep your dataset ready for training.</p>
                </div>
              </div>

              <UploadTips />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Upload;