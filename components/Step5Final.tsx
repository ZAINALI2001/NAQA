import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { auth, firestore } from '@/includes/FirebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import StatsComparison from '@/components/StatsComparison';
import StatsComparisonChart from '@/components/StatsComparisonChart';
import EnvironmentalTips from '@/components/EnvironmentalTips';

interface Props {
  formData: any;
  onRestart: () => void;
  onBack: () => void;
}

export default function Step5Final({ formData, onRestart, onBack }: Props) {
  const user = auth.currentUser;

  const convertKgToTonnes = (kg: number) => kg / 1000;

  const getNumberOfDaysInPeriod = () => {
    if (!formData.fromDate || !formData.toDate) return 1;
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both days
    return Math.max(diffDays, 1);
  };

  const calculateTotalEmissions = () => {
    let total = 0;
    const days = getNumberOfDaysInPeriod();
    const factor = days / 365;

    if (formData.electricityEmission) total += formData.electricityEmission * factor;
    if (formData.transportationEmission) total += formData.transportationEmission * factor;
    if (formData.generalEmission) total += formData.generalEmission * factor;

    return parseFloat(total.toFixed(2));
  };

  const totalEmissionsKg = calculateTotalEmissions();
  const totalEmissionsTonnes = convertKgToTonnes(totalEmissionsKg);
  const totalEmissionsStr = totalEmissionsTonnes.toFixed(3);

  const getClassification = (value: number): 'Excellent' | 'Good' | 'Moderate' | 'Poor' => {
    if (value < 3) return 'Excellent';
    if (value < 7) return 'Good';
    if (value < 12) return 'Moderate';
    return 'Poor';
  };

  const classification = getClassification(totalEmissionsTonnes);

  const getCardStyle = () => {
    switch (classification) {
      case 'Excellent':
        return {
          backgroundColor: '#E6F7EC',
          borderColor: '#7CD992',
          textColor: '#237804',
        };
      case 'Good':
        return {
          backgroundColor: '#FFFBE6',
          borderColor: '#FFD666',
          textColor: '#AD8B00',
        };
      case 'Moderate':
        return {
          backgroundColor: '#FFF1F0',
          borderColor: '#FFA39E',
          textColor: '#D4380D',
        };
      case 'Poor':
        return {
          backgroundColor: '#FDEDED',
          borderColor: '#F5222D',
          textColor: '#A8071A',
        };
      default:
        return {
          backgroundColor: '#F0FDF4',
          borderColor: '#CDE9D8',
          textColor: '#2E7D32',
        };
    }
  };

  const { backgroundColor, borderColor, textColor } = getCardStyle();

  const handleSave = async () => {
    try {
      if (!user) {
        Alert.alert('Error', 'You must be signed in to save.');
        return;
      }

      const {
        fromDate = '',
        toDate = '',
        electricityEmission = 0,
        transportationEmission = 0,
        generalEmission = 0,
      } = formData;

      const dataToSave = {
        Calculated_value: totalEmissionsStr,
        User_ID: user.uid,
        fromDate,
        toDate,
        electricityEmission,
        transportationEmission,
        generalEmission,
        Timestamp: serverTimestamp(),
      };

      console.log('Saving to Firestore:', dataToSave);

      await addDoc(collection(firestore, 'Carbon_footprint'), dataToSave);

      Alert.alert('✅ Saved', 'Your full data was saved successfully.');
    } catch (error) {
      console.error('🔥 Firestore Save Error:', error);
      Alert.alert('Error', 'Something went wrong while saving.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎉 Great Job!</Text>
      <Text style={styles.subtitle}>Here’s your personalized footprint summary 🌍</Text>

      {/* Result Card with Dynamic Colors */}
      <View
        style={[
          styles.resultCard,
          {
            backgroundColor,
            borderColor,
          },
        ]}
      >
        <Text style={[styles.resultLabel, { color: textColor }]}>Your Total Emissions:</Text>
        <Text style={[styles.resultValue, { color: textColor }]}>{totalEmissionsStr} Tonnes CO₂e</Text>
        <Text style={[styles.classification, { color: textColor }]}>{classification}</Text>
        <Text style={styles.periodNote}>📅 Based on a {getNumberOfDaysInPeriod()}-day period</Text>
      </View>

      {/* Visual Insights */}
      <StatsComparisonChart
        totalEmissionsTonnes={totalEmissionsTonnes}
        periodDays={getNumberOfDaysInPeriod()}
      />

      <StatsComparison
        totalEmissionsTonnes={totalEmissionsTonnes}
        periodDays={getNumberOfDaysInPeriod()}
      />
      <EnvironmentalTips classification={classification} />

      {/* Actions */}
      <View style={styles.buttonGroup}>
        <CustomButton title="💾 Save Footprint" onPress={handleSave} className="w-full" />
        <CustomButton title="⬅️ Back" onPress={onBack} className="w-full" />
        <CustomButton title="🔁 Restart" onPress={onRestart} className="w-full" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1779AE',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  resultLabel: {
    fontSize: 16,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  classification: {
    fontSize: 18,
    fontWeight: '600',
  },
  periodNote: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  buttonGroup: {
    marginTop: 30,
    gap: 14,
  },
});
