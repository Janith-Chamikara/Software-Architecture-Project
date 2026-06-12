import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lookupFine } from '../api/fineApi';
import ErrorMessage from './ErrorMessage';

/**
 * Step 1 — Driver enters their fine reference number and category identifier.
 * On success the fine details are passed to the next page via React Router state.
 */
function FineSearch() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [categoryIdentifier, setCategoryIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call GET /api/fines/lookup?ref=...&cat=...
      const fine = await lookupFine(
        referenceNumber.trim(),
        categoryIdentifier.trim().toUpperCase(),
      );
      // Pass the fetched fine forward so FineDetails doesn't need to re-fetch
      navigate('/fine-details', { state: { fine } });
    } catch (err) {
      if (err.response?.status === 404) {
        setError(
          'No fine found with these details. Please check your ticket carefully and try again.',
        );
      } else if (err.response?.status >= 500) {
        setError('The server is currently unavailable. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">

        {/* Page heading */}
        <h2 className="text-2xl font-bold text-blue-950 mb-1">Pay Your Traffic Fine</h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter the details exactly as they appear on your traffic ticket.
        </p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Reference number input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Fine Reference Number
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. REF-2026-001"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          {/* Category identifier input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Fine Category Identifier
            </label>
            <input
              type="text"
              value={categoryIdentifier}
              onChange={(e) => setCategoryIdentifier(e.target.value)}
              placeholder="e.g. SPEEDING"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
            <p className="mt-1 text-xs text-gray-400">
              Found in the top-right section of your ticket
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </span>
            ) : (
              'Find My Fine →'
            )}
          </button>
        </form>

        {/* Help note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Call the Traffic Fine Hotline:{' '}
            <strong className="text-blue-950">1920</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FineSearch;
