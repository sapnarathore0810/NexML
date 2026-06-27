function Toast({ message, tone = 'success' }) {
  if (!message) {
    return null;
  }

  const toneClasses =
    tone === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${toneClasses}`}>
      {message}
    </div>
  );
}

export default Toast;