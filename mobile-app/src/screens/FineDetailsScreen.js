import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import AppButton from "../components/AppButton";
import ScreenHeader from "../components/ScreenHeader";
import { colors, spacing, shadow, typography } from "../theme/theme";

const StatusPill = ({ status }) => {
  const isPaid = status === "PAID";
  return (
    <View style={[styles.pill, isPaid ? styles.pillPaid : styles.pillPending]}>
      <View style={[styles.pillDot, isPaid ? styles.dotPaid : styles.dotPending]} />
      <Text style={[styles.pillText, isPaid ? styles.pillTextPaid : styles.pillTextPending]}>
        {status}
      </Text>
    </View>
  );
};

const DetailRow = ({ label, value, mono }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, mono && styles.rowMono]}>{value}</Text>
  </View>
);

export default function FineDetailsScreen({ navigation, route }) {
  const { fine } = route.params;
  const isPaid = fine.status === "PAID";

  const formatAmount = (amt) =>
    `LKR ${Number(amt).toLocaleString("en-LK")}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Fine Details"
        subtitle={fine.referenceNumber}
        navigation={navigation}
        rightIcon="🏠"
        onRightPress={() => navigation.navigate("Home")}
      />

      {/* Hero: Amount + Status */}
      <View style={styles.hero}>
        <StatusPill status={fine.status} />
        <Text style={styles.amountLabel}>FINE AMOUNT</Text>
        <Text style={styles.amount}>{formatAmount(fine.amount)}</Text>
        <Text style={styles.refNumber}>{fine.referenceNumber}</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Details card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fine Details</Text>

          <DetailRow label="Reference Number" value={fine.referenceNumber} mono />
          <View style={styles.divider} />
          <DetailRow label="Category" value={fine.categoryIdentifier || fine.category || "—"} />
          <View style={styles.divider} />
          <DetailRow label="District" value={fine.district || "—"} />
          <View style={styles.divider} />
          <DetailRow label="Date Issued" value={formatDate(fine.issuedAt || fine.createdAt)} />
          <View style={styles.divider} />
          <DetailRow
            label="Status"
            value={fine.status}
          />
        </View>

        {/* Payment action */}
        {!isPaid ? (
          <View style={styles.payCard}>
            <View style={styles.payCardTop}>
              <Text style={styles.payCardAmount}>{formatAmount(fine.amount)}</Text>
              <Text style={styles.payCardLabel}>Due now</Text>
            </View>
            <Text style={styles.payCardInfo}>
              Payment is processed instantly. The issuing officer will be notified via SMS.
            </Text>
            <AppButton
              title="Pay Now"
              icon="💳"
              onPress={() =>
                navigation.navigate("Payment", {
                  fine,
                  amount: fine.amount,
                })
              }
              variant="accent"
            />
          </View>
        ) : (
          <View style={styles.paidBanner}>
            <Text style={styles.paidIcon}>✅</Text>
            <View>
              <Text style={styles.paidTitle}>Fine Paid</Text>
              <Text style={styles.paidSub}>This fine has already been paid.</Text>
            </View>
          </View>
        )}

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
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 20,
  },
  pillPaid: {
    backgroundColor: colors.successLight,
  },
  pillPending: {
    backgroundColor: colors.warningLight,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotPaid: {
    backgroundColor: colors.success,
  },
  dotPending: {
    backgroundColor: colors.accent,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  pillTextPaid: {
    color: colors.success,
  },
  pillTextPending: {
    color: colors.accentDark,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    marginBottom: 8,
  },
  amount: {
    fontSize: 42,
    fontWeight: "800",
    color: colors.textLight,
    letterSpacing: -1,
    marginBottom: 8,
  },
  refNumber: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  rowLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
  rowValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
    maxWidth: "55%",
    textAlign: "right",
  },
  rowMono: {
    fontFamily: "monospace",
    letterSpacing: 0.5,
    color: colors.primaryMid,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  payCard: {
    backgroundColor: colors.primaryMid,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.md,
  },
  payCardTop: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 10,
  },
  payCardAmount: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textLight,
  },
  payCardLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
  payCardInfo: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 18,
    marginBottom: 16,
  },
  paidBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.successLight,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.success,
  },
  paidIcon: {
    fontSize: 28,
  },
  paidTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.success,
    marginBottom: 2,
  },
  paidSub: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
