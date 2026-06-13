/**
 * Reusable error banner shown below forms when an API call fails.
 * Renders nothing when message is empty/null.
 */
function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-300 text-red-800 rounded-md px-4 py-3 mb-4">
      <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}

export default ErrorMessage;
