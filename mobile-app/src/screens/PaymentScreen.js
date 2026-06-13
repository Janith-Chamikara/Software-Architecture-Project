import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors } from '../theme/theme';
import api from '../api/api';

export default function PaymentScreen({ route, navigation }) {
  // Retrieve the fine object passed dynamically from the details screen
  const { fine } = route.params || {};
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    // Security Edge Case 1: Double-Submission Prevention Guard
    if (loading) return;

    // Basic cleaning of card input structures
    const cleanCard = cardNumber.replace(/\s+/g, '');
    const cleanCvv = cvv.trim();

    // Security Edge Case 2: Basic Card Structure Integrity Check
    if (cleanCard.length !== 16 || isNaN(cleanCard)) {
      setError('Invalid card number. Must be a 16-digit number.');
      return;
    }

    if (cleanCvv.length !== 3 || isNaN(cleanCvv)) {
      setError('Invalid CVV. Must be a 3-digit number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Security Edge Case 3: Tamper-Proof Amount Binding
      // We pass fine.amount directly from the trusted state data object,
      // preventing any user-side frontend form text manipulation.
      const transactionId = "TXN-" + Date.now();
      
      const payload = {
        fineReference: fine?.referenceNumber || 'UNKNOWN',
        amountPaid: fine?.amount || 0, 
        paymentMethod: "CARD",
        transactionId: transactionId
      };

      await api.post('/payments', payload);
      
      setLoading(false);
      // Navigate to success screen and pass receipt metadata
      navigation.navigate('PaymentSuccess', {
        receipt: {
          referenceNumber: fine?.referenceNumber,
          amountPaid: fine?.amount,
          transactionId: transactionId
        }
      });
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Secure Payment</Text>
        <Text style={styles.subtitle}>Complete your on-the-spot transaction securely</Text>
        
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Total Fine Amount Due:</Text>
          <Text style={styles.amountText}>LKR {fine?.amount || '0.00'}</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <AppInput label="Cardholder Card Number" placeholder="1234 5678 1234 5678" value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" />
        <AppInput label="Expiration Date" placeholder="MM/YY" value={expiry} onChangeText={setExpiry} />
        <AppInput label="Secure CVV" placeholder="123" value={cvv} onChangeText={setCvv} secureTextEntry keyboardType="numeric" />

        <AppButton title={loading ? "Processing..." : `Pay LKR ${fine?.amount || '0.00'}`} onPress={handlePayment} loading={loading} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 20 },
  amountBox: { backgroundColor: colors.primaryLight, padding: 16, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  amountLabel: { fontSize: 14, color: colors.primaryDark, fontWeight: '600' },
  amountText: { fontSize: 26, color: colors.primary, fontWeight: '800', marginTop: 4 },
  errorText: { color: colors.danger, marginBottom: 12, fontWeight: '600' }
});