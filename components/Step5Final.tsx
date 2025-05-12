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

  const calculateTotalEmissions = () => {
    let total = 0;
    if (formData.electricityEmission) total += formData.electricityEmission;
    if (formData.transportationEmission) total += formData.transportationEmission;
    if (formData.generalEmission) total += formData.generalEmission;
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

  const handleSave = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "You must be signed in to save.");
        return;
      }

      // Extract with fallbacks
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

      console.log("Saving to Firestore:", dataToSave);

      await addDoc(collection(firestore, 'Carbon_footprint'), dataToSave);

      Alert.alert("✅ Saved", "Your full data was saved successfully.");
    } catch (error) {
      console.error("🔥 Firestore Save Error:", error);
      Alert.alert("Error", "Something went wrong while saving.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎉 Great Job!</Text>
      <Text style={styles.subtitle}>Here’s your personalized footprint summary 🌍</Text>

      {/* Results Box */}
      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Your Total Emissions:</Text>
        <Text style={styles.resultValue}>{totalEmissionsStr} Tonnes CO₂e</Text>
        <Text style={styles.classification}>{classification}</Text>
      </View>

      {/* Visual Insights */}
      <StatsComparisonChart totalEmissionsTonnes={totalEmissionsTonnes} />
      <StatsComparison totalEmissionsTonnes={totalEmissionsTonnes} />
      <EnvironmentalTips classification={classification} />

      {/* Actions */}
      <View style={styles.buttonGroup}>
        <CustomButton
          title="💾 Save Footprint"
          onPress={handleSave}
          className="w-full"
        />
        <CustomButton
          title="⬅️ Back"
          onPress={onBack}
          className="w-full"
        />
        <CustomButton
          title="🔁 Restart"
          onPress={onRestart}
          className="w-full"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 50,
    // backgroundColor: '#E6F4F1',
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
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#CDE9D8',
  },
  resultLabel: {
    fontSize: 16,
    color: '#333',
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginVertical: 8,
  },
  classification: {
    fontSize: 18,
    fontWeight: '600',
    color: '#388E3C',
  },
  buttonGroup: {
    marginTop: 30,
    gap: 14,
  },
});
