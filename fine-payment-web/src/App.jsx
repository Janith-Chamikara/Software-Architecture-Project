import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FineSearch from './components/FineSearch';
import FineDetails from './components/FineDetails';
import PaymentForm from './components/PaymentForm';
import SuccessPage from './components/SuccessPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">

        {/* Portal header */}
        <header className="bg-blue-950 text-white shadow-lg">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
            {/* Badge icon */}
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-950 font-black text-xl">SLP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Sri Lanka Police</h1>
              <p className="text-blue-300 text-sm">Traffic Fine Payment Portal</p>
            </div>
          </div>
        </header>

        {/* Step indicator */}
        <div className="bg-blue-900 text-blue-200 text-xs text-center py-2 tracking-wide">
          Secure online payment powered by Stripe · Test Mode
        </div>

        {/* Page content */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<FineSearch />} />
            <Route path="/fine-details" element={<FineDetails />} />
            <Route path="/payment" element={<PaymentForm />} />
            <Route path="/success" element={<SuccessPage />} />
            {/* Redirect any unknown URL back to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t text-center text-gray-400 text-xs py-4">
          © 2026 Sri Lanka Police Department. All Rights Reserved. &nbsp;|&nbsp; Emergency: 119
        </footer>

      </div>
    </BrowserRouter>
  );
}

export default App;
