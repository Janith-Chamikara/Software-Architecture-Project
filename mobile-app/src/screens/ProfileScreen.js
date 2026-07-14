import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Screen from "../components/Screen";
import Card from "../components/Card";
import AppButton from "../components/AppButton";
import api from "../api/api";
import { clearTokens, clearCurrentUser, getCurrentUser } from "../storage/tokenStorage";
import { colors, spacing } from "../theme/theme";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser?.id) {
        throw new Error("No saved user session found. Please sign in again.");
      }

      const response = await api.get(`/users/${currentUser.id}`);
      setProfile(response.data);
    } catch (error) {
      console.log("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearTokens();
    await clearCurrentUser();
    // Reset navigation stack so the user cannot go back to protected screens
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <Screen>
      <Text style={styles.title}>Driver Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : !profile ? (
        <Text style={styles.errorText}>Unable to load profile information.</Text>
      ) : (
        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{profile?.fullName || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{profile?.phoneNumber || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Account Role:</Text>
            <Text style={styles.value}>{profile?.role || "DRIVER"}</Text>
          </View>
        </Card>
      )}

      <View style={styles.buttonContainer}>
        <AppButton 
          title="Payment History" 
          variant="primary"
          onPress={() => navigation.navigate("PaymentHistory")} 
        />
        <AppButton 
          title="Logout" 
          variant="danger" 
          onPress={handleLogout} 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primaryDark,
    marginBottom: spacing.md,
  },
  loader: {
    marginTop: spacing.xl,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "700",
  },
  buttonContainer: {
    marginTop: spacing.xl,
  },
});