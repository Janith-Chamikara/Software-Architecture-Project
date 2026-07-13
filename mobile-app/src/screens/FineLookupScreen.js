import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import ScreenHeader from "../components/ScreenHeader";
import api, { getErrorMessage } from "../api/api";
import { colors, spacing, radius, shadow, typography } from "../theme/theme";

export default function FineLookupScreen({ navigation }) {
  const [reference, setReference] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const categoryRef = useRef(null);

  const handleLookup = async () => {
    setError("");
    if (!reference.trim() || !category.trim()) {
      setError("Please enter both reference number and category identifier.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/fines/lookup", {
        params: {
          ref: reference.trim().toUpperCase(),
          cat: category.trim().toUpperCase(),
        },
      });
      navigation.navigate("FineDetails", { fine: res.data });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <ScreenHeader
        title="Find Your Fine"
        subtitle="Enter details from your notice"
        navigation={navigation}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fine Reference</Text>
          <Text style={styles.cardSubtitle}>
            Provided by the issuing traffic officer
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.fieldSection}>
            <AppInput
              label="Reference Number"
              icon="🔖"
              value={reference}
              onChangeText={setReference}
              placeholder="e.g. FINE001"
              autoCapitalize="characters"
              hint="Found on the top of your fine notice"
              returnKeyType="next"
              onSubmitEditing={() => categoryRef.current?.focus()}
            />
            <AppInput
              ref={categoryRef}
              label="Category Identifier"
              icon="📂"
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. SPEEDING"
              autoCapitalize="characters"
              hint="The violation type code"
              returnKeyType="done"
              onSubmitEditing={handleLookup}
            />
          </View>

          <AppButton
            title="Look Up Fine"
            onPress={handleLookup}
            loading={loading}
            icon="🔍"
          />
        </View>

        {/* Sample hint */}
        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>EXAMPLE</Text>
          <View style={styles.exampleRow}>
            <View style={styles.exampleItem}>
              <Text style={styles.exampleKey}>Reference</Text>
              <Text style={styles.exampleVal}>FINE001</Text>
            </View>
            <View style={styles.exampleDivider} />
            <View style={styles.exampleItem}>
              <Text style={styles.exampleKey}>Category</Text>
              <Text style={styles.exampleVal}>SPEEDING</Text>
            </View>
          </View>
        </View>
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
    paddingTop: 56,
    paddingBottom: 40,
    paddingHorizontal: spacing.lg,
    alignItems: "flex-start",
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroIcon: {
    fontSize: 24,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.textLight,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
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
    marginTop: 4,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 24,
  },
  fieldSection: {
    gap: 4,
  },
  exampleCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exampleLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  exampleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  exampleItem: {
    flex: 1,
    alignItems: "center",
  },
  exampleDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  exampleKey: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
    fontWeight: "600",
  },
  exampleVal: {
    fontSize: 15,
    fontWeight: "800",
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
  errorIcon: { fontSize: 16 },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.danger,
    fontWeight: "600",
    lineHeight: 18,
  },
});
