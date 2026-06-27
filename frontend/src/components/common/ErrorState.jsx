function ErrorState({ message, onRetry }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-4 py-2 font-semibold text-rose-600 transition-colors hover:bg-rose-100"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

export default ErrorState;