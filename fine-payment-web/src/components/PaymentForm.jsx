import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment } from '../api/paymentApi';
import ErrorMessage from './ErrorMessage';

// loadStripe is called once at module level (outside any component) to avoid
// re-initialising on every render. The key comes from the .env file — never hardcode it.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Styling for the Stripe CardElement to match the portal theme
const CARD_ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1e3a5f',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#dc2626' },
  },
};

// ── Inner card form (must be inside <Elements> to use Stripe hooks) ──────────

function CardPaymentForm({ clientSecret, fine, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return; // Stripe.js not yet loaded

    setLoading(true);
    setError(null);

    // Step A: Confirm the card charge with Stripe directly from the browser
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: elements.getElement(CardElement) } },
    );

    if (stripeError) {
      // Show the Stripe-provided error message (e.g. "Your card was declined")
      setError(stripeError.message || 'Payment failed. Please check your card details.');
      setLoading(false);
      return;
    }

    // Step B: Tell our backend to update the fine status and notify the officer
    try {
      await confirmPayment(paymentIntent.id, fine.referenceNumber);
      onSuccess(); // navigate to success page
    } catch (err) {
      // The charge was taken but our backend failed to update the record.
      // Show the PaymentIntent ID so support can reconcile manually.
      setError(
        `Your card was charged but we could not update the fine record. ` +
        `Please contact support with Payment ID: ${paymentIntent.id}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ErrorMessage message={error} />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Card Details
        </label>
        {/* Stripe's hosted card input — card data never touches our server */}
        <div className="border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition">
          <CardElement options={CARD_ELEMENT_STYLE} />
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          Test card: <span className="font-mono">4242 4242 4242 4242</span> · any future date · any CVC
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay LKR ${Number(fine.amount).toLocaleString()}`
        )}
      </button>
    </form>
  );
}

// ── Outer wrapper — fetches clientSecret, then mounts Stripe Elements ────────

function PaymentForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fine = state?.fine;

  const [clientSecret, setClientSecret] = useState(null);
  const [initError, setInitError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Guard: redirect home if no fine was passed
  useEffect(() => {
    if (!fine) {
      navigate('/', { replace: true });
      return;
    }

    // Call our backend to create a Stripe PaymentIntent and get the clientSecret
    const init = async () => {
      try {
        const data = await createPaymentIntent(fine.referenceNumber, fine.categoryIdentifier);
        setClientSecret(data.clientSecret);
      } catch (err) {
        if (err.response?.status === 409) {
          setInitError('This fine has already been paid.');
        } else if (err.response?.status === 404) {
          setInitError('Fine not found. Please go back and search again.');
        } else {
          setInitError('Could not initialise the payment session. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fine, navigate]);

  const handleSuccess = () => {
    navigate('/success', { state: { fine }, replace: true });
  };

  if (!fine) return null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-blue-950 mb-1">Secure Payment</h2>
        <p className="text-gray-500 text-sm mb-6">
          Fine reference: <span className="font-mono font-medium text-gray-700">{fine.referenceNumber}</span>
        </p>

        {/* Order summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Violation ({fine.categoryIdentifier})</span>
            <span>LKR {Number(fine.amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2">
            <span>Total Due</span>
            <span>LKR {Number(fine.amount).toLocaleString()}</span>
          </div>
        </div>

        {/* Loading spinner while creating the PaymentIntent */}
        {loading && (
          <div className="flex flex-col items-center py-8 text-gray-500">
            <span className="inline-block h-8 w-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Initialising secure payment session…</p>
          </div>
        )}

        {/* Initialisation error */}
        {initError && !loading && (
          <>
            <ErrorMessage message={initError} />
            <button
              onClick={() => navigate('/')}
              className="mt-2 w-full border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm transition-colors"
            >
              ← Back to Home
            </button>
          </>
        )}

        {/* Stripe card form — only shown once the clientSecret is ready */}
        {clientSecret && !initError && (
          // Do NOT pass clientSecret to Elements when using CardElement —
          // that mode is for PaymentElement only. Pass it directly to
          // stripe.confirmCardPayment() inside CardPaymentForm instead.
          <Elements stripe={stripePromise}>
            <CardPaymentForm
              clientSecret={clientSecret}
              fine={fine}
              onSuccess={handleSuccess}
            />
          </Elements>
        )}

        {/* Trust badge */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span>🔒</span>
          <span>Secured by Stripe. Your card data is never stored on our servers.</span>
        </div>

        {/* Back link */}
        {!loading && (
          <button
            onClick={() => navigate(-1)}
            className="mt-3 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back to fine details
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentForm;
