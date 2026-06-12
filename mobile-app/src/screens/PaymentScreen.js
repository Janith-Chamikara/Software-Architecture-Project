import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AppButton from "../components/AppButton";
import ScreenHeader from "../components/ScreenHeader";
import api, { getErrorMessage } from "../api/api";
import { colors, spacing, radius, shadow, typography } from "../theme/theme";

const METHODS = [
  { id: "CARD", label: "Credit / Debit Card", icon: "💳", sub: "Visa, Mastercard" },
  { id: "ONLINE_TRANSFER", label: "Online Transfer", icon: "🏦", sub: "Internet banking" },
  { id: "MOBILE_WALLET", label: "Mobile Wallet", icon: "📱", sub: "eZ Cash, mCash" },
];

export default function PaymentScreen({ navigation, route }) {
  const { fine, amount } = route.params;
  const [method, setMethod] = useState("CARD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const formatAmount = (amt) => `LKR ${Number(amt).toLocaleString("en-LK")}`;

  const handlePay = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setError("");
    setLoading(true);
    const transactionId = "TXN-" + Date.now();
    try {
      const res = await api.post("/payments", {
        fineReference: fine.referenceNumber,
        amountPaid: Number(amount),
        paymentMethod: method,
        transactionId,
      });
      navigation.replace("PaymentSuccess", {
        reference: fine.referenceNumber,
        amount,
        transactionId,
        paymentData: res.data,
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Payment"
        subtitle={fine.referenceNumber}
        navigation={navigation}
      />

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>AMOUNT DUE</Text>
        <Text style={styles.heroAmount}>{formatAmount(amount)}</Text>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{fine.referenceNumber}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fine Reference</Text>
            <Text style={styles.summaryValue}>{fine.referenceNumber}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Category</Text>
            <Text style={styles.summaryValue}>
              {fine.categoryIdentifier || fine.category || "—"}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={[styles.summaryValue, styles.summaryTotal]}>
              {formatAmount(amount)}
            </Text>
          </View>
        </View>

        {/* Payment method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodCard, method === m.id && styles.methodSelected]}
            onPress={() => setMethod(m.id)}
            activeOpacity={0.8}
          >
            <View style={styles.methodLeft}>
              <View
                style={[
                  styles.methodIconWrap,
                  method === m.id && styles.methodIconWrapSelected,
                ]}
              >
                <Text style={styles.methodIcon}>{m.icon}</Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.methodLabel,
                    method === m.id && styles.methodLabelSelected,
                  ]}
                >
                  {m.label}
                </Text>
                <Text style={styles.methodSub}>{m.sub}</Text>
              </View>
            </View>
            <View
              style={[
                styles.radioOuter,
                method === m.id && styles.radioOuterSelected,
              ]}
            >
              {method === m.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Mock notice */}
        <View style={styles.mockNotice}>
          <Text style={styles.mockIcon}>ℹ️</Text>
          <Text style={styles.mockText}>
            This is a mock payment demo. No real transaction will occur.
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {confirming && !loading ? (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>
              Tap again to confirm payment of {formatAmount(amount)}
            </Text>
          </View>
        ) : null}

        <AppButton
          title={
            loading
              ? "Processing..."
              : confirming
              ? `Confirm — ${formatAmount(amount)}`
              : `Pay ${formatAmount(amount)}`
          }
          onPress={handlePay}
          loading={loading}
          variant={confirming ? "success" : "accent"}
          icon={loading ? undefined : "🔒"}
        />
        {confirming && !loading ? (
          <AppButton
            title="Cancel"
            onPress={() => setConfirming(false)}
            variant="ghost"
          />
        ) : null}
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
    paddingBottom: 44,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroAmount: {
    fontSize: 44,
    fontWeight: "800",
    color: colors.textLight,
    letterSpacing: -1,
    marginBottom: 14,
  },
  heroBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1,
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
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  summaryTotal: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryMid,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 12,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.sm,
  },
  methodSelected: {
    borderColor: colors.primaryMid,
    backgroundColor: colors.primaryLight,
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  methodIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodIconWrapSelected: {
    backgroundColor: colors.primaryMid,
    borderColor: colors.primaryMid,
  },
  methodIcon: {
    fontSize: 20,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  methodLabelSelected: {
    color: colors.primaryMid,
  },
  methodSub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: colors.primaryMid,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.primaryMid,
  },
  mockNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.warningLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  mockIcon: {
    fontSize: 16,
  },
  mockText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.dangerLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
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
  confirmBox: {
    backgroundColor: colors.successLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.success,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: "600",
    textAlign: "center",
  },
});
