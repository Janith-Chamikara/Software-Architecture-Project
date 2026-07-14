import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import { colors } from '../theme/theme';

export default function PaymentHistoryScreen() {
  const history = [{ id: 'TXN-001', amount: '2500', date: '2026-05-10' }];

  return (
    <Screen>
      <Text style={styles.title}>Payment History</Text>
      <ScrollView>
        {history.map((item) => (
          <Card key={item.id} style={styles.card}>
            <Text style={styles.txId}>{item.id}</Text>
            <Text style={styles.amount}>LKR {item.amount}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text, margin: 20 },
  card: { marginBottom: 10, padding: 15 },
  txId: { fontWeight: '700' },
  amount: { color: colors.success, fontWeight: '700' }
});