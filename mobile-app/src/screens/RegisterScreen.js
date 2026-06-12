import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import api, { getErrorMessage } from "../api/api";
import { saveTokens } from "../storage/tokenStorage";
import { colors, spacing, radius, shadow, typography } from "../theme/theme";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (!fullName.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      // sign-up already returns tokens directly
      const res = await api.post("/auth/sign-up", {
        fullName: fullName.trim(),
        phoneNumber: phone.trim(),
        role: "DRIVER",
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
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>DRIVER REGISTRATION</Text>
        <Text style={styles.heroTitle}>Create your{"\n"}account</Text>
        <Text style={styles.heroSubtitle}>
          Register to pay traffic fines instantly
        </Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>Driver Details</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <AppInput
            label="Full Name"
            icon="👤"
            value={fullName}
            onChangeText={setFullName}
            placeholder="As on your NIC"
            autoCapitalize="words"
          />
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
            placeholder="Min. 8 characters"
            secureTextEntry
            hint="Use a strong password to protect your account"
          />
          <AppInput
            label="Confirm Password"
            icon="✅"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter password"
            secureTextEntry
          />

          <View style={styles.roleTag}>
            <Text style={styles.roleTagIcon}>🚗</Text>
            <Text style={styles.roleTagText}>
              Registering as <Text style={styles.roleTagBold}>DRIVER</Text>
            </Text>
          </View>

          <AppButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            variant="accent"
          />
        </View>

        <TouchableOpacity
          style={styles.loginRow}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.7}
        >
          <Text style={styles.loginText}>
            Already registered?{" "}
            <Text style={styles.loginLink}>Sign in instead</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: spacing.lg,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    ...typography.hero,
    color: colors.textLight,
    lineHeight: 40,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  bodyContent: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
  },
  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryMid,
    letterSpacing: 0.5,
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
  roleTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  roleTagIcon: {
    fontSize: 16,
  },
  roleTagText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  roleTagBold: {
    fontWeight: "800",
    color: colors.accentDark,
  },
  loginRow: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontWeight: "700",
    color: colors.primaryMid,
  },
});
