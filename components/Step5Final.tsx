import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { auth, firestore } from '@/includes/FirebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import StatsComparison from '@/components/StatsComparison';
import StatsComparisonChart from '@/components/StatsComparisonChart';
import EnvironmentalTips from '@/components/EnvironmentalTips';
import { Ionicons } from '@expo/vector-icons';

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

  const getClassification = (value: number, days: number): 'Excellent' | 'Good' | 'Moderate' | 'Poor' => {
  const factor = days / 365;

  const excellentThreshold = 3 * factor;
  const goodThreshold = 7 * factor;
  const moderateThreshold = 12 * factor;

  if (value < excellentThreshold) return 'Excellent';
  if (value < goodThreshold) return 'Good';
  if (value < moderateThreshold) return 'Moderate';
  return 'Poor';
};


const days = getNumberOfDaysInPeriod();
const classification = getClassification(totalEmissionsTonnes, days);

  const getCardStyle = () => {
    switch (classification) {
      case 'Excellent':
        return {
          backgroundColor: '#E0F7E9',
          borderColor: '#66BB6A',
          textColor: '#1B5E20',
        };
      case 'Good':
        return {
          backgroundColor: '#FFF8E1',
          borderColor: '#FFCA28',
          textColor: '#F57F17',
        };
      case 'Moderate':
        return {
          backgroundColor: '#FFF3E0',
          borderColor: '#FFB74D',
          textColor: '#E65100',
        };
      case 'Poor':
        return {
          backgroundColor: '#FFEBEE',
          borderColor: '#EF5350',
          textColor: '#B71C1C',
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

  const getHeaderTitle = (classification: string): string => {
    switch (classification) {
      case 'Excellent':
        return '🌱 Outstanding Effort!';
      case 'Good':
        return '✅ Nice Work!';
      case 'Moderate':
        return '⚠️ Room to Improve';
      case 'Poor':
        return '🚨 Let’s Work on It';
      default:
        return '📊 Your Carbon Summary';
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{getHeaderTitle(classification)}</Text>
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
      {/* <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Save Footprint</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onBack}>
        <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity> */}
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
    marginBottom: 15,
    color: '#2A608F',
    alignSelf: 'center',
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
  button: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#1779AE',
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 16,
  marginBottom: 14,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2, // For Android
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
});
