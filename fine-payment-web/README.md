# Traffic Fine Payment – Web Portal

React SPA for drivers to pay Sri Lanka Police traffic fines online via Stripe.

---

## Prerequisites

- Node.js 18+
- The NestJS backend running (see below)
- A free [Stripe account](https://dashboard.stripe.com/register) — test mode is fine

---

## 1. Set Up the Backend

### Install Stripe in the backend

```bash
cd Software-Architecture-Project/backend
npm install stripe
```

### Configure the backend `.env`

Copy the sample and fill in your values:

```bash
cp .env.sample .env
```

Edit `backend/.env` and replace the placeholder with your **Stripe secret key**  
(found at https://dashboard.stripe.com/test/apikeys under **Secret key**):

```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

### Start the backend

```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000`.  
Swagger docs: `http://localhost:3000/api/docs`

---

## 2. Set Up the Frontend

### Install dependencies

```bash
cd Software-Architecture-Project/fine-payment-web
npm install
```

### Configure the frontend `.env`

Edit `fine-payment-web/.env` and add your **Stripe publishable key**  
(found at https://dashboard.stripe.com/test/apikeys under **Publishable key**):

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

> The `.env` file is already listed in `.gitignore` — never commit your keys.

### Start the frontend

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 3. Test the Payment Flow

1. **Seed the database** (if not done already):
   ```bash
   cd backend && npm run db:seed
   ```

2. Open `http://localhost:5173`, enter a fine reference number and category.

3. On the payment form use Stripe's test card:
   - **Card number:** `4242 4242 4242 4242`
   - **Expiry:** any future date (e.g. `12/34`)
   - **CVC:** any 3 digits (e.g. `123`)

4. After payment, the backend will log an SMS notification for the officer in the terminal.

---

## Project Structure

```
fine-payment-web/
├── src/
│   ├── api/
│   │   ├── fineApi.js          # GET /api/fines/lookup
│   │   └── paymentApi.js       # POST /api/payment/create-intent & confirm
│   ├── components/
│   │   ├── FineSearch.jsx      # Step 1 – enter reference & category
│   │   ├── FineDetails.jsx     # Step 2 – review fine before paying
│   │   ├── PaymentForm.jsx     # Step 3 – Stripe card form
│   │   ├── SuccessPage.jsx     # Step 4 – confirmation screen
│   │   └── ErrorMessage.jsx    # Reusable error banner
│   ├── App.jsx                 # Router + layout (header / footer)
│   ├── main.jsx
│   └── index.css               # Tailwind directives
├── .env                        # VITE_STRIPE_PUBLISHABLE_KEY (not committed)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Backend Changes Made

The following files were added / modified in `backend/src/payment/`:

| File | What it does |
|---|---|
| `dto/stripe.dto.ts` | Validation DTOs for the two new endpoints |
| `stripe-payment.service.ts` | Stripe PaymentIntent creation + confirmation logic |
| `stripe-payment.controller.ts` | `POST /api/payment/create-intent` and `POST /api/payment/confirm` (both public — no JWT required) |
| `payment.module.ts` | Registers the two new classes |

`backend/.env.sample` was updated to include `STRIPE_SECRET_KEY`.

---

## API Endpoints (new)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/payment/create-intent` | None | Create Stripe PaymentIntent; returns `clientSecret` |
| POST | `/api/payment/confirm` | None | Verify Stripe payment, mark fine PAID, SMS officer |

> **Note on currency:** Stripe requires the smallest currency unit (cents). Because Stripe does not support LKR, this demo uses **USD** and treats the LKR amount directly as cents (LKR 3500 → $35.00). In a production system you would integrate a supported local payment gateway.
