import { FiFileText, FiTrash2 } from 'react-icons/fi';

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / 1024 ** unitIndex;

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function FileDetails({ fileName, fileSize, uploadTime, onRemove }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
            <FiFileText />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Selected File</h3>
            <p className="mt-1 break-all text-sm text-slate-600">{fileName}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
              <span>File Name: {fileName}</span>
              <span>File Size: {formatFileSize(fileSize)}</span>
              <span>Upload Time: {uploadTime}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        >
          <FiTrash2 />
          Remove File
        </button>
      </div>
    </div>
  );
}

export default FileDetails;