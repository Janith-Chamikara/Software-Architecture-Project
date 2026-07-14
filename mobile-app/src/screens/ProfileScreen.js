import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import AppButton from '../components/AppButton';
import { colors } from '../theme/theme';

export default function ProfileScreen({ navigation }) {
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Driver Profile</Text>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>Udari Perera</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>077 123 4567</Text>
        </View>
        <AppButton title="Back to Home" variant="outline" onPress={() => navigation.goBack()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 20 },
  infoBox: { marginBottom: 15 },
  label: { fontSize: 12, color: colors.textMuted },
  value: { fontSize: 16, fontWeight: '600', color: colors.text }
});