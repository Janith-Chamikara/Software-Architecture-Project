import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import AppButton from '../components/AppButton';
import { colors } from '../theme/theme';

export default function FineDetailsScreen({ route, navigation }) {
  // Extract the fine data object dynamically passed from the lookup stream
  const { fine } = route.params || {};

  // Check if the fine status is already marked as PAID
  const isAlreadyPaid = fine?.status?.toUpperCase() === 'PAID';

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Fine Record Details</Text>
        <Text style={styles.subtitle}>Verified ticket breakdown from police network</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Reference Number:</Text>
            <Text style={styles.value}>{fine?.referenceNumber || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Violation Category:</Text>
            <Text style={styles.value}>{fine?.categoryIdentifier || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>District Location:</Text>
            <Text style={styles.value}>{fine?.district || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Penalty Due:</Text>
            <Text style={[styles.value, styles.priceText]}>LKR {fine?.amount || '0.00'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Current Ticket Status:</Text>
            <Text 
              style={[
                styles.statusBadge, 
                isAlreadyPaid ? styles.paidBadge : styles.pendingBadge
              ]}
            >
              {fine?.status || 'PENDING'}
            </Text>
          </View>
        </View>

        {/* Operational Security Boundary Rule: Block traffic navigation if fine state is PAID */}
        {isAlreadyPaid ? (
          <View style={styles.successAlertBox}>
            <Text style={styles.successAlertText}>
              ✓ This fine has been settled. Your license is cleared for retrieval.
            </Text>
            <AppButton 
              title="Back to Home Dashboard" 
              variant="primary" 
              onPress={() => navigation.navigate('Home')} 
            />
          </View>
        ) : (
          <AppButton 
            title="Proceed to On-The-Spot Payment" 
            variant="primary" 
            onPress={() => navigation.navigate('Payment', { fine })} 
          />
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 20 },
  detailsContainer: { marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center' },
  label: { fontSize: 14, color: colors.textMuted, fontWeight: '500' },
  value: { fontSize: 15, color: colors.text, fontWeight: '600' },
  priceText: { color: colors.danger, fontSize: 16, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: '700', overflow: 'hidden' },
  pendingBadge: { backgroundColor: colors.warningLight, color: colors.warning },
  paidBadge: { backgroundColor: colors.successLight, color: colors.success },
  successAlertBox: { marginTop: 15, padding: 14, backgroundColor: colors.successLight, borderRadius: 8 },
  successAlertText: { color: colors.success, fontWeight: '600', fontSize: 13, marginBottom: 12, textAlign: 'center' }
});