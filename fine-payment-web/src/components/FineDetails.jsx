import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Step 2 — Displays the fine details fetched in FineSearch.
 * If the driver arrived here without going through FineSearch (e.g. direct URL),
 * they are redirected back to the home page.
 */
function FineDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fine = state?.fine;

  // Guard: redirect to home if no fine data is available
  useEffect(() => {
    if (!fine) navigate('/', { replace: true });
  }, [fine, navigate]);

  if (!fine) return null;

  const isPaid = fine.status === 'PAID';

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">

        {/* Heading */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📋</span>
          <div>
            <h2 className="text-2xl font-bold text-blue-950">Fine Details</h2>
            <p className="text-gray-500 text-sm">Please review before proceeding to payment</p>
          </div>
        </div>

        {/* Warning banner for unpaid fines */}
        {!isPaid && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 mb-6 text-sm text-amber-800">
            ⚠️ This fine is <strong>unpaid</strong>. Failure to pay may result in additional penalties.
          </div>
        )}

        {/* Detail table */}
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden mb-6">
          <Row label="Reference Number" value={fine.referenceNumber} mono />
          <Row label="Violation Category" value={fine.categoryIdentifier} />
          <Row label="District" value={fine.district} />
          <Row label="Date Issued" value={formatDate(fine.issuedAt)} />
          <Row
            label="Status"
            value={
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                  isPaid
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {fine.status}
              </span>
            }
          />
        </div>

        {/* Amount row */}
        <div className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-4 mb-6">
          <span className="text-gray-700 font-semibold">Amount Due</span>
          <span className="text-2xl font-extrabold text-blue-950">
            {formatCurrency(fine.amount)}
          </span>
        </div>

        {/* Action buttons */}
        {isPaid ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
              <p className="text-green-800 font-semibold text-sm">✅ This fine has already been paid.</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-blue-700 underline text-sm hover:text-blue-900"
            >
              Check another fine
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/payment', { state: { fine } })}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Proceed to Payment →
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              ← Search Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Row({ label, value, mono = false }) {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white even:bg-gray-50">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function formatCurrency(amount) {
  return `LKR ${Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default FineDetails;
