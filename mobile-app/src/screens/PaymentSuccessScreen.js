import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
} from "react-native";
import AppButton from "../components/AppButton";
import { colors, spacing, shadow, typography } from "../theme/theme";

const ReceiptRow = ({ label, value, mono, highlight }) => (
  <View style={styles.receiptRow}>
    <Text style={styles.receiptLabel}>{label}</Text>
    <Text
      style={[
        styles.receiptValue,
        mono && styles.receiptMono,
        highlight && styles.receiptHighlight,
      ]}
    >
      {value}
    </Text>
  </View>
);

export default function PaymentSuccessScreen({ navigation, route }) {
  const { reference, amount, transactionId } = route.params;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const formatAmount = (amt) => `LKR ${Number(amt).toLocaleString("en-LK")}`;
  const now = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.success} />

      {/* Success hero */}
      <View style={styles.hero}>
        <Animated.View
          style={[
            styles.checkWrap,
            { transform: [{ scale }], opacity },
          ]}
        >
          <View style={styles.checkRing}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </Animated.View>

        <Text style={styles.heroTitle}>Payment Successful</Text>
        <Text style={styles.heroAmount}>{formatAmount(amount)}</Text>
        <Text style={styles.heroSub}>Your fine has been paid</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptHeaderIcon}>🧾</Text>
            <Text style={styles.receiptHeaderTitle}>Payment Receipt</Text>
            <View style={styles.receiptStamp}>
              <Text style={styles.receiptStampText}>PAID</Text>
            </View>
          </View>

          <View style={styles.receiptDivider} />

          <ReceiptRow label="Fine Reference" value={reference} mono />
          <View style={styles.receiptDivider} />
          <ReceiptRow label="Transaction ID" value={transactionId} mono />
          <View style={styles.receiptDivider} />
          <ReceiptRow label="Amount Paid" value={formatAmount(amount)} highlight />
          <View style={styles.receiptDivider} />
          <ReceiptRow label="Date & Time" value={now} />

          {/* Perforated bottom */}
          <View style={styles.perfLine}>
            {[...Array(16)].map((_, i) => (
              <View key={i} style={styles.perfDot} />
            ))}
          </View>

          {/* SMS notice */}
          <View style={styles.smsNotice}>
            <Text style={styles.smsIcon}>📨</Text>
            <View style={styles.smsBody}>
              <Text style={styles.smsTitle}>Officer Notified</Text>
              <Text style={styles.smsSub}>
                An SMS notification has been sent to the issuing traffic police officer.
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <AppButton
          title="Back to Home"
          icon="🏠"
          onPress={() => navigation.replace("Home")}
          variant="success"
        />
        <AppButton
          title="Pay Another Fine"
          icon="🔍"
          onPress={() => navigation.replace("FineLookup")}
          variant="outline"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.success,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  checkWrap: {
    marginBottom: 20,
  },
  checkRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
  },
  checkIcon: {
    fontSize: 42,
    color: colors.textLight,
    fontWeight: "900",
    lineHeight: 50,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textLight,
    marginBottom: 8,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.textLight,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSub: {
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
  receiptCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  receiptHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: 10,
  },
  receiptHeaderIcon: {
    fontSize: 20,
  },
  receiptHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  receiptStamp: {
    backgroundColor: colors.successLight,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.success,
  },
  receiptStampText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.success,
    letterSpacing: 1,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  receiptLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    maxWidth: "55%",
    textAlign: "right",
  },
  receiptMono: {
    fontFamily: "monospace",
    fontSize: 12,
    color: colors.textSecondary,
  },
  receiptHighlight: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.success,
  },
  perfLine: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    borderStyle: "dashed",
  },
  perfDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  smsNotice: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    padding: spacing.lg,
    backgroundColor: colors.successLight,
  },
  smsIcon: {
    fontSize: 20,
    marginTop: 1,
  },
  smsBody: {
    flex: 1,
  },
  smsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.success,
    marginBottom: 3,
  },
  smsSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
});
