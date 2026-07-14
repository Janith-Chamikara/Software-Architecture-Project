import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import Screen from "../components/Screen";
import Card from "../components/Card";
import api from "../api/api";
import { getCurrentUser } from "../storage/tokenStorage";
import { colors, spacing } from "../theme/theme";

export default function PaymentHistoryScreen() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await getCurrentUser();
      if (!currentUser?.id) {
        throw new Error("No saved user session found. Please sign in again.");
      }

      const response = await api.get(`/users/${currentUser.id}`);
      setPayments(response.data?.payments || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to load payment history."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentItem = ({ item }) => (
    <Card>
      <View style={styles.cardHeader}>
        <Text style={styles.referenceText}>{item.fineReference}</Text>
        <Text style={styles.amountText}>LKR {item.amountPaid}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.detailText}>Method: {item.paymentMethod}</Text>
        <Text style={styles.detailText}>Txn ID: {item.transactionId}</Text>
        <Text style={styles.dateText}>
          {new Date(item.paidAt || Date.now()).toLocaleDateString()}
        </Text>
      </View>
    </Card>
  );

  return (
    <Screen>
      <Text style={styles.title}>Payment History</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : payments.length === 0 ? (
        <Text style={styles.emptyText}>No past payments found.</Text>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item, index) => item.transactionId || index.toString()}
          renderItem={renderPaymentItem}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Disabled because it's wrapped inside Screen's ScrollView
        />
      )}
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
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  referenceText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.success,
  },
  cardBody: {
    marginTop: spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: "right",
  },
});