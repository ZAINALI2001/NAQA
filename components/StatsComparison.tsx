import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  totalEmissionsTonnes: number;
  periodDays: number;
}

export default function StatsComparison({ totalEmissionsTonnes, periodDays }: Props) {
  const globalAnnualAvg = 4.7;
  const saudiAnnualAvg = 9.5;
  const scale = periodDays / 365;

  const globalAvgScaled = parseFloat((globalAnnualAvg * scale).toFixed(2));
  const saudiAvgScaled = parseFloat((saudiAnnualAvg * scale).toFixed(2));

  const getClassification = (value: number): string => {
    if (value < 3) return '🌱 Excellent';
    if (value < 7) return '✅ Good';
    if (value < 12) return '⚠️ Moderate';
    return '🚨 Poor';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Ranking for {periodDays}-Day Period</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Your Footprint:</Text>
        <Text style={styles.value}>{totalEmissionsTonnes} Tonnes CO₂e</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Global Avg (scaled):</Text>
        <Text style={styles.value}>{globalAvgScaled} Tonnes CO₂e</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Saudi Avg (scaled):</Text>
        <Text style={styles.value}>{saudiAvgScaled} Tonnes CO₂e</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2A608F',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});
