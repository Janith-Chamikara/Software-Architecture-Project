# Traffic Fine Payment Mobile App

Modern React Native + Expo Go mobile application for the Sri Lanka Police Traffic Fine Payment System.

This mobile app is the **driver-side Android/mobile application** used for on-the-spot traffic fine payment. It connects with the NestJS backend REST API and allows a driver to register, login, search traffic fines, view fine details, and complete a mock payment.

---

## 1. Project Summary

The system is designed to modernize traffic fine payments. When a police officer issues a traffic fine, the driver receives:

- Fine reference number
- Fine category identifier

Using the mobile app, the driver can enter these details, view the fine amount, and pay immediately.

After successful payment:

1. Backend validates the payment.
2. Backend creates a payment record.
3. Backend marks the fine as `PAID`.
4. Backend triggers SMS notification to the issuing traffic police officer.
5. Mobile app displays payment success confirmation.

The mobile app does **not** directly send SMS. SMS is handled by the backend notification service.

---

## 2. Mobile App Scope

### Must-have features

- Driver registration
- Driver login
- JWT token handling
- Fine lookup using reference number and category identifier
- Fine details display
- Mock payment submission
- Payment success screen
- Basic error handling
- Clean modern mobile UI

### Optional features

- Payment history
- Profile page
- Refresh token handling
- Dark mode
- Real payment gateway
- Push notifications

For fast project completion, finish the must-have features first.

---

## 3. Technology Stack

### Mobile App

- React Native
- Expo Go
- JavaScript
- Axios
- React Navigation
- Expo Secure Store

### Backend

- NestJS
- Prisma
- SQLite
- JWT authentication
- REST API

---

## 4. Project Folder Structure

Recommended structure inside the repository:

```txt
Software-Architecture-Project/
│
├── backend/
├── web-portal/
├── admin-portal/
├── mobile-app/
│   ├── App.js
│   ├── package.json
│   ├── app.json
│   ├── assets/
│   └── src/
│       ├── api/
│       │   └── api.js
│       │
│       ├── storage/
│       │   └── tokenStorage.js
│       │
│       ├── theme/
│       │   └── theme.js
│       │
│       ├── components/
│       │   ├── AppButton.js
│       │   ├── AppInput.js
│       │   ├── Card.js
│       │   └── Screen.js
│       │
│       └── screens/
│           ├── LoginScreen.js
│           ├── RegisterScreen.js
│           ├── HomeScreen.js
│           ├── FineLookupScreen.js
│           ├── FineDetailsScreen.js
│           ├── PaymentScreen.js
│           └── PaymentSuccessScreen.js
│
└── README.md
```

---

## 5. Setup Instructions

Go to the mobile app folder:

```bash
cd mobile-app
```

Install packages:

```bash
npm install axios
npm install @react-navigation/native
npm install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-secure-store
```

Optional web support:

```bash
npx expo install react-dom react-native-web
```

Start the app:

```bash
npx expo start
```

Then:

- Scan QR code using Expo Go on Android phone.
- Or press `w` to open in web browser.
- Or press `a` to open Android emulator if configured.

---

## 6. Running Backend and Mobile Together

Open two terminals.

### Terminal 1: Backend

```bash
cd backend
npm run start:dev
```

Backend should show:

```txt
Running in development mode on port 3000
Swagger Docs available at http://localhost:3000/api/docs
```

### Terminal 2: Mobile App

```bash
cd mobile-app
npx expo start
```

---

## 7. Backend Base URL

The backend uses `/api` prefix.

### If testing in browser

```js
export const BASE_URL = "http://localhost:3000/api";
```

### If testing on physical phone using Expo Go

Do not use `localhost`.

Use your laptop IP address.

Example:

```js
export const BASE_URL = "http://192.168.8.100:3000/api";
```

In the current Expo Metro output, the local IP appears as:

```txt
192.168.8.100
```

So the recommended API base URL is:

```js
export const BASE_URL = "http://192.168.8.100:3000/api";
```

The phone and laptop must be connected to the same Wi-Fi network.

---

## 8. API Configuration

Create:

```txt
src/api/api.js
```

```js
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const BASE_URL = "http://192.168.8.100:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

---

## 9. Token Storage

Create:

```txt
src/storage/tokenStorage.js
```

```js
import * as SecureStore from "expo-secure-store";

export async function saveTokens(accessToken, refreshToken) {
  await SecureStore.setItemAsync("accessToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
}

export async function getAccessToken() {
  return await SecureStore.getItemAsync("accessToken");
}

export async function getRefreshToken() {
  return await SecureStore.getItemAsync("refreshToken");
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
}
```

For quick project demonstration, refresh-token logic can be skipped. If access token expires, login again.

---

## 10. App Screens

### Screen list

```txt
Login Screen
Register Screen
Home Screen
Fine Lookup Screen
Fine Details Screen
Payment Screen
Payment Success Screen
```

Optional:

```txt
Payment History Screen
Profile Screen
```

---

## 11. Navigation Setup

Replace `App.js` with:

```js
import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import FineLookupScreen from "./src/screens/FineLookupScreen";
import FineDetailsScreen from "./src/screens/FineDetailsScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import PaymentSuccessScreen from "./src/screens/PaymentSuccessScreen";
import { colors } from "./src/theme/theme";

const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.primary,
    text: colors.textLight,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.textLight,
          headerTitleStyle: {
            fontWeight: "700",
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Create Account" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Traffic Fine Payment" }} />
        <Stack.Screen name="FineLookup" component={FineLookupScreen} options={{ title: "Find Fine" }} />
        <Stack.Screen name="FineDetails" component={FineDetailsScreen} options={{ title: "Fine Details" }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Payment" }} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ title: "Payment Successful" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## 12. Modern UI Theme

Create:

```txt
src/theme/theme.js
```

```js
export const colors = {
  primary: "#1E3A8A",
  primaryDark: "#172554",
  primaryLight: "#DBEAFE",

  accent: "#F59E0B",
  accentLight: "#FEF3C7",

  success: "#16A34A",
  successLight: "#DCFCE7",

  danger: "#DC2626",
  dangerLight: "#FEE2E2",

  warning: "#F59E0B",
  warningLight: "#FEF3C7",

  background: "#F8FAFC",
  card: "#FFFFFF",
  input: "#F1F5F9",

  text: "#111827",
  textMuted: "#64748B",
  textLight: "#FFFFFF",

  border: "#E2E8F0",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 30,
};

export const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
};
```

---

## 13. Modern Design Direction

### Visual style

Use a clean government-service style:

```txt
Modern
Professional
Trustworthy
Simple
Mobile-friendly
Readable
```

### Suggested color feel

```txt
Navy blue = official and trustworthy
White cards = clean layout
Amber accent = call-to-action highlight
Green = payment success
Red = errors
```

### Suggested app title

```txt
Traffic Fine Pay
```

### Suggested tagline

```txt
Fast and secure traffic fine payments
```

---

## 14. Reusable UI Components

To keep the app clean, create simple reusable components.

### AppButton

Create:

```txt
src/components/AppButton.js
```

```js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, radius, spacing } from "../theme/theme";

export default function AppButton({ title, onPress, loading, variant = "primary", disabled }) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && styles.primary,
        isDanger && styles.danger,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.textLight} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    backgroundColor: colors.textMuted,
  },
  text: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "700",
  },
});
```

---

### AppInput

Create:

```txt
src/components/AppInput.js
```

```js
import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { colors, radius, spacing } from "../theme/theme";

export default function AppInput({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
});
```

---

### Screen Wrapper

Create:

```txt
src/components/Screen.js
```

```js
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { colors, spacing } from "../theme/theme";

export default function Screen({ children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
  },
});
```

---

### Card

Create:

```txt
src/components/Card.js
```

```js
import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, radius, spacing, shadow } from "../theme/theme";

export default function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
});
```

---

## 15. Screen Requirements and API Integration

### 15.1 Login Screen

Fields:

```txt
Phone Number
Password
```

Endpoint:

```txt
POST /auth/sign-in
```

Request:

```json
{
  "phoneNumber": "0771234567",
  "password": "password123"
}
```

After success:

```txt
Save accessToken
Save refreshToken
Navigate to Home
```

---

### 15.2 Register Screen

Fields:

```txt
Full Name
Phone Number
Password
Confirm Password
```

Endpoint:

```txt
POST /auth/sign-up
```

Request:

```json
{
  "fullName": "Test Driver",
  "phoneNumber": "0771234567",
  "role": "DRIVER",
  "password": "password123"
}
```

Important:

```txt
Mobile app must always register user role as DRIVER.
```

---

### 15.3 Home Screen

Show:

```txt
Welcome message
Pay Traffic Fine button
Logout button
```

Optional:

```txt
Payment History button
```

---

### 15.4 Fine Lookup Screen

Fields:

```txt
Fine Reference Number
Category Identifier
```

Endpoint:

```txt
GET /fines/lookup?ref=<referenceNumber>&cat=<categoryIdentifier>
```

Example:

```txt
GET /fines/lookup?ref=FINE001&cat=SPEEDING
```

After success:

```txt
Navigate to FineDetails screen
```

---

### 15.5 Fine Details Screen

Show:

```txt
Reference Number
Category Identifier
Amount
District
Issued Date
Status
```

Rule:

```txt
If status is PAID, disable Pay Now.
If status is PENDING, allow Pay Now.
```

---

### 15.6 Payment Screen

Endpoint:

```txt
POST /payments
```

Headers:

```txt
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:

```json
{
  "fineReference": "FINE001",
  "amountPaid": 3000,
  "paymentMethod": "CARD",
  "transactionId": "TXN-17123456789"
}
```

Generate transaction ID:

```js
const transactionId = "TXN-" + Date.now();
```

After successful payment:

```txt
Navigate to PaymentSuccess screen
```

---

### 15.7 Payment Success Screen

Show:

```txt
Payment Successful
Fine Reference Number
Amount Paid
Transaction ID
SMS notification sent to police officer
Back to Home button
```

---

## 16. Error Handling

Use backend HTTP status and message.

| Status | Meaning | Mobile Message |
|---|---|---|
| 400 | Bad request | Please check the entered details. |
| 401 | Unauthorized | Session expired. Please login again. |
| 403 | Forbidden | You do not have permission for this action. |
| 404 | Not found | Fine not found. |
| 409 | Conflict | This fine may already be paid. |
| 500 | Server error | Server error. Please try again later. |

Recommended error helper:

```js
export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}
```

---

## 17. Test Data

### Driver

```json
{
  "fullName": "Test Driver",
  "phoneNumber": "0771234567",
  "role": "DRIVER",
  "password": "password123"
}
```

### Officer

```json
{
  "fullName": "Test Officer",
  "phoneNumber": "0711234567",
  "role": "OFFICER",
  "password": "password123"
}
```

### Fine

```json
{
  "referenceNumber": "FINE001",
  "categoryIdentifier": "SPEEDING",
  "amount": 3000,
  "district": "Colombo",
  "driverNic": "200012345678"
}
```

### Payment

```json
{
  "fineReference": "FINE001",
  "amountPaid": 3000,
  "paymentMethod": "CARD",
  "transactionId": "TXN-17123456789"
}
```

---

## 18. Testing Order

Test in this order:

```txt
1. Start backend.
2. Open Swagger: http://localhost:3000/api/docs
3. Register driver.
4. Login driver.
5. Create officer if required.
6. Login as officer and create a fine if endpoint requires officer role.
7. Start Expo app.
8. Register/login from mobile.
9. Search fine from mobile.
10. Pay fine from mobile.
11. Confirm payment success screen.
12. Check backend fine status changed to PAID.
```

---

## 19. Common Problems

### App cannot connect to backend from phone

Cause:

```txt
Using localhost instead of laptop IP.
```

Fix:

```js
export const BASE_URL = "http://192.168.8.100:3000/api";
```

---

### 401 Unauthorized on payment

Possible causes:

```txt
Access token not saved
Authorization header missing
Token expired
Logged-in user role is not DRIVER
JWT secret mismatch in backend
```

Fix:

```txt
Login again
Check SecureStore
Check Axios interceptor
Check backend JWT settings
```

---

### Payment says fine already paid

Cause:

```txt
Fine status is already PAID.
```

Fix:

```txt
Create a new fine with a new reference number.
```

---

### Transaction ID conflict

Cause:

```txt
transactionId must be unique.
```

Fix:

```js
const transactionId = "TXN-" + Date.now();
```

---

## 20. Development Plan

Complete in this order:

```txt
1. Setup Expo project.
2. Install dependencies.
3. Create folder structure.
4. Add theme.js.
5. Add reusable components.
6. Add api.js.
7. Add tokenStorage.js.
8. Add navigation in App.js.
9. Build Login screen.
10. Build Register screen.
11. Build Home screen.
12. Build Fine Lookup screen.
13. Build Fine Details screen.
14. Build Payment screen.
15. Build Payment Success screen.
16. Test full backend integration.
17. Clean UI.
18. Commit code.
```

---

## 21. Suggested Git Commits

Commit regularly.

```txt
Initial Expo app setup
Installed navigation and API dependencies
Added mobile app theme
Added reusable UI components
Added API service and token storage
Added navigation structure
Added login screen
Added register screen
Added home screen
Added fine lookup screen
Integrated fine lookup API
Added fine details screen
Added payment screen
Integrated payment API
Added payment success screen
Improved mobile UI design
Added error handling
Final mobile app cleanup
```

---

## 22. Viva Explanation

Use this explanation:

```txt
I developed the driver-side mobile application using React Native and Expo. The app allows a driver to register, login, search a traffic fine using the fine reference number and category identifier, view the fine details, and complete payment using a mock payment flow.

The app connects to the NestJS backend through REST APIs. JWT access tokens are securely stored using Expo Secure Store and added to protected requests using the Authorization Bearer header.

After payment is submitted, the backend validates the fine, creates the payment record, changes the fine status to PAID, and triggers the notification service to send an SMS to the issuing traffic police officer. The mobile app then shows a payment success confirmation to the driver.
```

---

## 23. Final Checklist

Before demo or submission:

- [ ] Backend runs on port 3000.
- [ ] Swagger opens at `/api/docs`.
- [ ] Expo app runs.
- [ ] App opens in Expo Go.
- [ ] Base URL uses laptop IP address.
- [ ] Driver registration works.
- [ ] Driver login works.
- [ ] JWT token is stored.
- [ ] Fine lookup works.
- [ ] Fine details are displayed.
- [ ] Payment request works.
- [ ] Payment success screen appears.
- [ ] Already paid fine is handled.
- [ ] Error messages are clear.
- [ ] UI has modern theme.
- [ ] Code is committed to GitHub.

---

## 24. Final Scope Decision

Do not overcomplicate the mobile app.

### Build this first

```txt
Register
Login
Home
Fine Lookup
Fine Details
Payment
Payment Success
```

### Add only if time remains

```txt
Payment history
Profile page
Dark mode
Refresh token
Animations
```

Working backend integration is more important than complex UI.
