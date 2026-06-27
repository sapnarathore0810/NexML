import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SummaryCards from '../components/preview/SummaryCards';
import DatasetTable from '../components/preview/DatasetTable';
import DataTypes from '../components/preview/DataTypes';
import MissingValues from '../components/preview/MissingValues';
import Insights from '../components/preview/Insights';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { fetchDatasetInfo } from '../services/nexmlApi';

const datasetRows = [
  { id: 1, Age: 22, Salary: 54000, Gender: 'Female', Purchased: 'Yes' },
  { id: 2, Age: 29, Salary: 72000, Gender: 'Male', Purchased: 'No' },
  { id: 3, Age: 35, Salary: 81000, Gender: 'Female', Purchased: 'Yes' },
  { id: 4, Age: 41, Salary: 91000, Gender: 'Male', Purchased: 'Yes' },
  { id: 5, Age: 26, Salary: 61000, Gender: 'Female', Purchased: 'No' },
  { id: 6, Age: 31, Salary: 68000, Gender: 'Male', Purchased: 'Yes' },
  { id: 7, Age: 48, Salary: 99000, Gender: 'Female', Purchased: 'No' },
  { id: 8, Age: 33, Salary: 76000, Gender: 'Male', Purchased: 'Yes' },
  { id: 9, Age: 38, Salary: 85000, Gender: 'Female', Purchased: 'Yes' },
  { id: 10, Age: 24, Salary: 57000, Gender: 'Male', Purchased: 'No' },
];

const datasetSummary = [
  { label: 'Rows', value: '12,450', description: 'Total records' },
  { label: 'Columns', value: '18', description: 'Feature count' },
  { label: 'Missing Values', value: '2%', description: 'Low missing rate' },
  { label: 'Categorical Columns', value: '5', description: 'Non-numeric fields' },
  { label: 'Numerical Columns', value: '13', description: 'Numeric features' },
  { label: 'Dataset Size', value: '4.2 MB', description: 'CSV upload size' },
];

const dataTypes = [
  { name: 'Age', type: 'Integer', example: '22, 29, 41' },
  { name: 'Salary', type: 'Float', example: '54000.00, 81000.00' },
  { name: 'Gender', type: 'Category', example: 'Male, Female' },
  { name: 'Purchased', type: 'Boolean', example: 'Yes, No' },
];

const missingValues = [
  { column: 'Age', count: 8, percentage: 1.2 },
  { column: 'Salary', count: 12, percentage: 1.8 },
  { column: 'Gender', count: 0, percentage: 0 },
  { column: 'Purchased', count: 6, percentage: 0.9 },
];

const insights = [
  'Dataset looks balanced.',
  'Only 2% missing values.',
  'Suitable for Classification.',
  'No duplicate rows detected.',
];

function Preview() {
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast, showToast } = useToast();

  const loadPreview = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetchDatasetInfo();
      setDatasetInfo(response.data);
      showToast('Dataset preview loaded.', 'success');
    } catch (error) {
      setDatasetInfo(null);
      setErrorMessage(error?.response?.data?.message || 'Unable to load dataset preview.');
      showToast('Preview request failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview();
  }, []);

  const summaryCards = datasetInfo
    ? [
        { label: 'Rows', value: datasetInfo.summary.rows.toLocaleString(), description: 'Total records' },
        { label: 'Columns', value: String(datasetInfo.summary.columns), description: 'Feature count' },
        { label: 'Missing Values', value: `${datasetInfo.summary.missing_values}%`, description: 'Low missing rate' },
        { label: 'Categorical Columns', value: '5', description: 'Non-numeric fields' },
        { label: 'Numerical Columns', value: '13', description: 'Numeric features' },
        { label: 'Dataset Size', value: datasetInfo.summary.dataset_size, description: 'CSV upload size' },
      ]
    : datasetSummary;

  const rowsToRender = datasetInfo?.rows_preview || datasetRows;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm">
        <Toast message={toast.message} tone={toast.tone} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Dataset Preview
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Dataset Preview
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Review your uploaded dataset before training.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {errorMessage ? <ErrorState message={errorMessage} onRetry={loadPreview} /> : null}
          {loading ? <LoadingSpinner label="Loading dataset preview..." /> : null}

          <SummaryCards items={summaryCards} />
          <DatasetTable rows={rowsToRender} />

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <DataTypes items={dataTypes} />
            <MissingValues items={missingValues} />
          </div>

          <Insights items={insights} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </Link>
            <Link
              to="/target-selection"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              Select Target <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Preview;