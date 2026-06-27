import { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import DatasetSummary from '../components/target/DatasetSummary';
import FeatureList from '../components/target/FeatureList';
import TargetDropdown from '../components/target/TargetDropdown';
import TargetInfo from '../components/target/TargetInfo';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { fetchDatasetInfo, selectTargetColumn } from '../services/nexmlApi';

const columns = [
  { name: 'Age', type: 'Integer', uniqueValues: 42, missingValues: 12, problem: 'regression' },
  { name: 'Gender', type: 'Category', uniqueValues: 2, missingValues: 0, problem: 'classification' },
  { name: 'Salary', type: 'Float', uniqueValues: 381, missingValues: 18, problem: 'regression' },
  { name: 'Purchased', type: 'Boolean', uniqueValues: 2, missingValues: 6, problem: 'classification' },
  { name: 'Education', type: 'Category', uniqueValues: 6, missingValues: 3, problem: 'classification' },
  { name: 'Experience', type: 'Integer', uniqueValues: 28, missingValues: 4, problem: 'regression' },
];

const datasetSummary = [
  { label: 'Rows', value: '12,450' },
  { label: 'Columns', value: '18' },
  { label: 'Missing Values', value: '2%' },
  { label: 'Dataset Type', value: 'Tabular' },
];

function TargetSelection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('Purchased');
  const [summaryItems, setSummaryItems] = useState(datasetSummary);
  const [targetDetails, setTargetDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast, showToast } = useToast();

  const filteredColumns = useMemo(
    () =>
      columns.filter((column) =>
        column.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      ),
    [searchTerm],
  );

  const selectedColumn = columns.find((column) => column.name === selectedTarget) || columns[3];
  const displayColumn = targetDetails || selectedColumn;

  const loadDatasetMeta = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetchDatasetInfo();
      const summary = response.data.summary;

      setSummaryItems([
        { label: 'Rows', value: summary.rows.toLocaleString() },
        { label: 'Columns', value: String(summary.columns) },
        { label: 'Missing Values', value: `${summary.missing_values}%` },
        { label: 'Dataset Type', value: 'Tabular' },
      ]);
      showToast('Target data loaded from backend.', 'success');
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to load target data.');
      showToast('Failed to load target data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasetMeta();
  }, []);

  useEffect(() => {
    const syncTarget = async () => {
      try {
        const response = await selectTargetColumn(selectedTarget);
        setTargetDetails({
          name: selectedTarget,
          type: response.data.target_info.data_type,
          uniqueValues: response.data.target_info.unique_values,
          missingValues: response.data.target_info.missing_values,
          problem: response.data.problem_type,
        });
      } catch {
        setTargetDetails(selectedColumn);
      }
    };

    syncTarget();
  }, [selectedTarget]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm">
        <Toast message={toast.message} tone={toast.tone} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Target Selection
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Select Target Column
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Choose the column that your machine learning model should predict.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {errorMessage ? <ErrorState message={errorMessage} onRetry={loadDatasetMeta} /> : null}
          {loading ? <LoadingSpinner label="Loading target data..." /> : null}

          <DatasetSummary items={summaryItems} />

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <TargetDropdown
                value={searchTerm}
                onChange={setSearchTerm}
                options={filteredColumns}
                selectedTarget={selectedTarget}
                onSelect={setSelectedTarget}
              />
              <TargetInfo column={displayColumn} />
            </div>

            <div className="space-y-6">
              <FeatureList columns={columns} selectedTarget={selectedTarget} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/preview"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </Link>
            <Link
              to="/training"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              Start Training <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TargetSelection;