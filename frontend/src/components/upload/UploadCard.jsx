import { FiUploadCloud, FiFileText } from 'react-icons/fi';

function UploadCard({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFileChange,
  validationMessage,
  hasFile,
}) {
  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        onDragEnter();
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault();
        onDragLeave();
      }}
      onDrop={onDrop}
      className={`rounded-[2rem] border-2 border-dashed p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300 sm:p-10 ${
        isDragging
          ? 'border-indigo-400 bg-indigo-50/80'
          : 'border-slate-300 bg-white hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]'
      }`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-3xl text-white shadow-lg shadow-indigo-500/20">
          <FiUploadCloud />
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-slate-950">Drop your CSV file here</h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
          Drag and drop your dataset or browse from your device. Only CSV files are accepted.
        </p>

        <label className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-slate-800">
          Browse File
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={onFileChange} />
        </label>

        <div className="mt-6 flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
          <FiFileText className="text-indigo-600" />
          {hasFile ? 'CSV file selected' : 'Upload a CSV file to continue'}
        </div>

        {validationMessage ? (
          <p
            className={`mt-5 text-sm font-medium ${
              validationMessage.includes('Invalid') ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {validationMessage.includes('Invalid') ? '❌' : '✅'} {validationMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default UploadCard;