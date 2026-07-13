import React, { useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors } from '../theme/theme';
import api from '../api/api';
export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleRegister = async () => {
    const cleanName = fullName.trim();
    const cleanPhone = phoneNumber.trim();
    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    // Edge Case 1: Empty Fields Check
    if (!cleanName || !cleanPhone || !cleanPassword || !cleanConfirmPassword) {
      setError('All fields are required.');
      return;
    }

    // Edge Case 2: Sri Lankan Mobile Number Regular Expression Validation
    const slPhoneRegex = /^(07[01245678]\d{7})$/;
    if (!slPhoneRegex.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Sri Lankan phone number (e.g., 0771234567).');
      return;
    }

    // Edge Case 3: Password Strength Length Guard
    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Edge Case 4: Password Confirmation Equality Check
    if (cleanPassword !== cleanConfirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/sign-up', {
        fullName: cleanName,
        phoneNumber: cleanPhone,
        role: 'DRIVER', 
        password: cleanPassword
      });
      
      setLoading(false);
      navigation.navigate('Login'); 
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register as a driver for instant traffic fine settlements</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <AppInput
          label="Full Name"
          placeholder="e.g., Perera"
          value={fullName}
          onChangeText={setFullName}
          returnKeyType="next"
          onSubmitEditing={() => phoneNumberRef.current?.focus()}
        />
        <AppInput
          ref={phoneNumberRef}
          label="Phone Number"
          placeholder="e.g., 0771234567"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <AppInput
          ref={passwordRef}
          label="Password"
          placeholder="Minimum 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />
        <AppInput
          ref={confirmPasswordRef}
          label="Confirm Password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />
        <AppButton title="Sign Up" onPress={handleRegister} loading={loading} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 20 },
  errorText: { color: colors.danger, marginBottom: 12, fontWeight: '600' }
});