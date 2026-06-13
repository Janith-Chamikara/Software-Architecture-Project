import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import api, { getErrorMessage } from "../api/api";
import { saveTokens } from "../storage/tokenStorage";
import { colors, spacing, shadow, typography } from "../theme/theme";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!phone.trim() || !password.trim()) {
      setError("Please enter your phone number and password.");
      return;
    }
    setLoading(true);
    try {
      // Passport local strategy reads "email" field; SignInDto validation also needs "phoneNumber"
      const res = await api.post("/auth/sign-in", {
        email: phone.trim(),
        phoneNumber: phone.trim(),
        password: password.trim(),
      });
      const { accessToken, refreshToken } = res.data;
      await saveTokens(accessToken, refreshToken);
      navigation.replace("Home");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>🛡️</Text>
        </View>
        <Text style={styles.appTitle}>Traffic Fine Pay</Text>
        <Text style={styles.appTagline}>Sri Lanka Police · Official App</Text>
      </View>

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your driver account</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <AppInput
            label="Phone Number"
            icon="📱"
            value={phone}
            onChangeText={setPhone}
            placeholder="077 123 4567"
            keyboardType="phone-pad"
          />
          <AppInput
            label="Password"
            icon="🔒"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            variant="accent"
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.7}
          >
            <Text style={styles.registerText}>
              New driver?{" "}
              <Text style={styles.registerLink}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          By continuing you agree to the terms of the{"\n"}Sri Lanka Police Traffic Fine System.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  hero: {
    alignItems: "center",
    paddingTop: 72,
    paddingBottom: 52,
    paddingHorizontal: spacing.lg,
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.28)",
    marginBottom: 16,
  },
  badgeIcon: {
    fontSize: 34,
  },
  appTitle: {
    ...typography.h1,
    color: colors.textLight,
    marginBottom: 6,
  },
  appTagline: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  sheetContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
    marginTop: 4,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.dangerLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.danger,
    fontWeight: "600",
    lineHeight: 18,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  registerBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  registerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerLink: {
    color: colors.primaryMid,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 24,
    lineHeight: 17,
  },
});
