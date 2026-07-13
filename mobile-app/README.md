# Traffic Fine Pay — Mobile App

Driver-side mobile application for the Sri Lanka Police Traffic Fine Payment System.  
Built with **React Native + Expo Go**.

---

## What This App Does

Drivers use this app to look up and pay traffic fines on the spot.

**Flow:**
1. Driver receives a fine notice with a reference number and category code
2. Opens the app → registers or logs in
3. Enters the reference number and category → views fine details and amount
4. Pays the fine (mock payment)
5. Gets a confirmation receipt — backend marks the fine as PAID and SMS-notifies the officer

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.85 + Expo SDK 56 |
| Language | JavaScript |
| Navigation | React Navigation v7 (native stack) |
| HTTP | Axios |
| Secure Storage | expo-secure-store (native) / localStorage (web) |
| Backend | NestJS REST API on port 3000 |

---

## Prerequisites

- Node.js 18+
- npm
- Expo Go app on your phone **or** a web browser (for web mode)

---

## Setup & Run

### 1. Install dependencies

All dependencies are already in `package.json`. From the `mobile-app` folder:

```bash
npm install
```

### 2. Configure the API base URL

Open `src/api/api.js` and set the correct URL:

**Running in web browser (same machine as backend):**
```js
export const BASE_URL = "http://localhost:3000/api";
```

**Running on a physical phone via Expo Go:**
```js
export const BASE_URL = "http://<your-laptop-ip>:3000/api";
```

Your laptop IP appears in the Expo Metro output:
```
› Metro: exp://192.168.x.x:8081
```

Use that IP — phone and laptop must be on the same Wi-Fi.

### 3. Start the app

```bash
npx expo start
```

Then choose:

| Key | Action |
|---|---|
| `w` | Open in web browser |
| `a` | Open in Android emulator |
| Scan QR | Open in Expo Go on your phone |

### 4. Start the backend (separate terminal)

```bash
cd ../backend
npm run start:dev
```

Backend runs at `http://localhost:3000`  
Swagger docs at `http://localhost:3000/api/docs`

---

## Folder Structure

```
mobile-app/
├── App.js                        # Navigation setup (entry point)
├── index.js                      # Expo entry
├── app.json                      # Expo config
├── package.json
│
├── assets/                       # App icons and splash screen
│
└── src/
    ├── api/
    │   └── api.js                # Axios instance + auth interceptor + error handler
    │
    ├── storage/
    │   └── tokenStorage.js       # JWT token save/get/clear (SecureStore on native, localStorage on web)
    │
    ├── theme/
    │   └── theme.js              # Colors, spacing, radius, shadow, typography
    │
    ├── components/
    │   ├── AppButton.js          # Button with variants: primary, accent, outline, ghost, danger, success
    │   ├── AppInput.js           # Input with label, icon, focus state, password toggle
    │   ├── Card.js               # Card with shadow variants
    │   ├── Screen.js             # SafeArea + KeyboardAvoiding scroll wrapper
    │   └── ScreenHeader.js       # Custom header with back button and optional right icon
    │
    └── screens/
        ├── LoginScreen.js        # Phone + password login
        ├── RegisterScreen.js     # Driver account registration (auto-login after)
        ├── HomeScreen.js         # Dashboard with Pay Fine CTA
        ├── FineLookupScreen.js   # Search fine by reference + category
        ├── FineDetailsScreen.js  # Fine info, amount, status, Pay Now button
        ├── PaymentScreen.js      # Payment method selection + confirm flow
        └── PaymentSuccessScreen.js # Animated receipt with transaction details
```

---

## Screens

### Login
- Phone number + password
- Navigates to Home on success
- In-screen error messages (no popup alerts)

### Register
- Full name, phone, password (min 8 chars), confirm password
- Role is always set to `DRIVER` automatically
- Auto-logs in after registration → goes straight to Home

### Home
- Welcome dashboard
- **Pay a Traffic Fine** main CTA card
- How it works overview
- Sign out

### Fine Lookup
- Enter **Reference Number** (e.g. `FINE001`) and **Category Identifier** (e.g. `SPEEDING`)
- Both are on the physical fine notice
- Calls `GET /fines/lookup?ref=...&cat=...`

### Fine Details
- Shows amount, status (PAID / PENDING), district, date issued
- **Pay Now** button — only active when status is PENDING
- If already PAID, shows a paid banner

### Payment
- Displays the fine amount due
- Select payment method: Card / Online Transfer / Mobile Wallet
- Two-tap confirmation (tap once to prime, tap again to confirm)
- Calls `POST /payments`

### Payment Success
- Animated checkmark on load
- Receipt card: reference, transaction ID, amount, timestamp
- "PAID" stamp badge
- SMS notification notice
- Back to Home / Pay Another Fine buttons

---

## API Endpoints Used

| Screen | Method | Endpoint |
|---|---|---|
| Login | POST | `/auth/sign-in` |
| Register | POST | `/auth/sign-up` |
| Fine Lookup | GET | `/fines/lookup?ref=&cat=` |
| Payment | POST | `/payments` |

All protected requests include `Authorization: Bearer <token>` automatically via Axios interceptor.

---

## Test Data

Use these values to test end-to-end (create via Swagger at `/api/docs` first):

**Driver account:**
```
Phone: 0771234567
Password: password123
```

**Fine to look up:**
```
Reference Number: FINE001
Category:         SPEEDING
```

**Payment:**
```
Method: CARD
Amount: auto-filled from fine
Transaction ID: auto-generated (TXN-<timestamp>)
```

---

## Common Issues

| Problem | Cause | Fix |
|---|---|---|
| Cannot connect to backend from phone | Using `localhost` instead of laptop IP | Change `BASE_URL` to `http://192.168.x.x:3000/api` |
| 401 on payment | Token not saved or expired | Sign out and log in again |
| Fine not found | Wrong reference or category | Check exact values in Swagger or backend DB |
| Fine already paid | Status is already PAID | Create a new fine via Swagger |

---

## Notes for Group Members

- This folder (`mobile-app/`) is the **driver mobile app** — only modify files inside this folder
- The backend (`backend/`) is a separate student's responsibility — do not modify it
- The web portal and admin portal are other students' parts
- JWT tokens expire after 15 minutes — log in again if you get a 401
