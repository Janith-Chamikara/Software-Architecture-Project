import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Step 4 — Shown after a successful payment.
 * Confirms to the driver that their fine is paid and the officer has been notified.
 */
function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fine = state?.fine;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8 text-center">

        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-4xl">✅</span>
        </div>

        <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your traffic fine has been paid. The issuing officer has been notified via SMS.
        </p>

        {/* Receipt summary */}
        {fine && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg text-left divide-y divide-gray-200 mb-6">
            <ReceiptRow label="Reference Number" value={fine.referenceNumber} mono />
            <ReceiptRow label="Violation" value={fine.categoryIdentifier} />
            <ReceiptRow label="District" value={fine.district} />
            <ReceiptRow
              label="Amount Paid"
              value={`LKR ${Number(fine.amount).toLocaleString('en-LK', {
                minimumFractionDigits: 2,
              })}`}
              bold
            />
          </div>
        )}

        {/* Reminder note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-left mb-6">
          <p className="text-blue-800 text-sm">
            <strong>Keep this as your receipt.</strong> Your fine status has been updated
            to <strong>PAID</strong>. You may be asked to produce proof of payment.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Pay Another Fine
        </button>
      </div>
    </div>
  );
}

function ReceiptRow({ label, value, mono = false, bold = false }) {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm text-gray-800 ${mono ? 'font-mono' : ''} ${bold ? 'font-bold text-blue-950' : 'font-medium'}`}
      >
        {value}
      </span>
    </div>
  );
}

export default SuccessPage;
