import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import AppButton from "../components/AppButton";
import { clearTokens, clearCurrentUser } from "../storage/tokenStorage";
import { colors, spacing, radius, shadow, typography } from "../theme/theme";

const QuickInfoItem = ({ icon, title, value, color }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={[styles.infoValue, color && { color }]}>{value}</Text>
  </View>
);

export default function HomeScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await clearTokens();
          await clearCurrentUser();
          navigation.replace("Login");
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good day, Driver</Text>
            <Text style={styles.headerTitle}>Traffic Fine Pay</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout}>
            <Text style={styles.avatarIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeIcon}>🛡️</Text>
          <Text style={styles.headerBadgeText}>Sri Lanka Police · Official System</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main CTA card */}
        <TouchableOpacity
          style={styles.mainCard}
          onPress={() => navigation.navigate("FineLookup")}
          activeOpacity={0.88}
        >
          <View style={styles.mainCardLeft}>
            <View style={styles.mainCardBadge}>
              <Text style={styles.mainCardBadgeText}>PAY NOW</Text>
            </View>
            <Text style={styles.mainCardTitle}>Pay a{"\n"}Traffic Fine</Text>
            <Text style={styles.mainCardSub}>
              Enter reference number{"\n"}to look up and pay instantly
            </Text>
          </View>
          <View style={styles.mainCardRight}>
            <View style={styles.mainCardIconWrap}>
              <Text style={styles.mainCardIcon}>💳</Text>
            </View>
            <Text style={styles.mainCardArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Info grid */}
        <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
        <View style={styles.infoGrid}>
          <QuickInfoItem icon="🔍" title="Lookup" value="Find your fine" />
          <QuickInfoItem icon="📋" title="Review" value="Check details" />
          <QuickInfoItem icon="💳" title="Pay" value="Secure payment" />
          <QuickInfoItem icon="✅" title="Done" value="Instant confirm" color={colors.success} />
        </View>

        {/* Notice card */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>ℹ️</Text>
          <View style={styles.noticeBody}>
            <Text style={styles.noticeTitle}>Have your fine details ready</Text>
            <Text style={styles.noticeText}>
              You will need the fine reference number and category identifier from your fine notice.
            </Text>
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.signOutWrap}>
          <AppButton
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            icon="🚪"
          />
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
  header: {
    paddingTop: 56,
    paddingBottom: 36,
    paddingHorizontal: spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textLight,
    letterSpacing: -0.5,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },
  avatarIcon: {
    fontSize: 20,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignSelf: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerBadgeIcon: {
    fontSize: 13,
  },
  headerBadgeText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    letterSpacing: 0.5,
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
  mainCard: {
    backgroundColor: colors.primaryMid,
    borderRadius: 24,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    marginTop: 4,
    ...shadow.lg,
    overflow: "hidden",
  },
  mainCardLeft: {
    flex: 1,
    paddingRight: 16,
  },
  mainCardBadge: {
    backgroundColor: colors.accent,
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  mainCardBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textLight,
    letterSpacing: 1.2,
  },
  mainCardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textLight,
    lineHeight: 30,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  mainCardSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 18,
  },
  mainCardRight: {
    alignItems: "center",
    gap: 12,
  },
  mainCardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  mainCardIcon: {
    fontSize: 26,
  },
  mainCardArrow: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.accent,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 8,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: spacing.lg,
  },
  infoItem: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  infoIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
    textAlign: "center",
  },
  noticeCard: {
    flexDirection: "row",
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: spacing.md,
    gap: 12,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(30,58,138,0.15)",
    marginBottom: spacing.lg,
  },
  noticeIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  noticeBody: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryMid,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  signOutWrap: {
    marginTop: 8,
  },
});
