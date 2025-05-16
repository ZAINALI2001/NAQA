import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/includes/FirebaseConfig';
import CustomButton from '@/components/CustomButton';
import { Entypo } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';

type TransportationEntry = {
  mode: string | null;
  distance: string;
};

type FetchedTransport = {
  mode: string;
  emissionFactor: number;
};

type Props = {
  formData: any;
  setFormData: any;
  onNext: () => void;
  onBack: () => void;
};

export default function Step2Transportation({ formData, setFormData, onNext, onBack }: Props) {
  const [transportEntries, setTransportEntries] = useState<TransportationEntry[]>(formData.transportation || [{
    mode: null,
    distance: ''
  }]);
  const [fetchedTransportData, setFetchedTransportData] = useState<FetchedTransport[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleTooltipIndex, setVisibleTooltipIndex] = useState<number | null>(null);

  useEffect(() => {
    setFormData({ ...formData, transportation: transportEntries });
  }, [transportEntries]);

  useEffect(() => {
    const fetchTransportationData = async () => {
      try {
        const footprintCollection = collection(firestore, 'Indecator');
        const querySnapshot = await getDocs(footprintCollection);

        const transports: FetchedTransport[] = querySnapshot.docs
          .filter(doc => doc.data()['Category ']?.trim() === 'Transportation')
          .map(doc => ({
            mode: doc.data().Indecator_Name.trim(),
            emissionFactor: doc.data().Emission_factor_value,
          }));

        setFetchedTransportData(transports);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transportation data:', error);
        setLoading(false);
      }
    };

    fetchTransportationData();
  }, []);

  const handleAddTransport = () => {
    setTransportEntries([...transportEntries, { mode: null, distance: '' }]);
  };

  const handleRemoveTransport = (index: number) => {
    const newEntries = [...transportEntries];
    newEntries.splice(index, 1);
    setTransportEntries(newEntries);
  };

  const handleModeChange = (value: string | null, index: number) => {
    const newEntries = [...transportEntries];
    newEntries[index].mode = value;
    setTransportEntries(newEntries);
  };

  const handleDistanceChange = (text: string, index: number) => {
    const newEntries = [...transportEntries];
    newEntries[index].distance = Math.max(0, parseFloat(text) || 0).toString();
    setTransportEntries(newEntries);
  };

  const calculateTotalTransportationEmission = () => {
    let totalEmission = 0;
    transportEntries.forEach((entry: TransportationEntry) => {
      const distance = parseFloat(entry.distance || '0');
      const selectedMode = entry.mode;
      const factor = fetchedTransportData.find(t => t.mode === selectedMode)?.emissionFactor || 0;
      totalEmission += distance * factor;
    });
    return totalEmission;
  };

  const handleNextStep = () => {
    const totalTransportationEmission = calculateTotalTransportationEmission();
    setFormData({ ...formData, transportationEmission: totalTransportationEmission });
    onNext();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1779AE" />
        <Text>Loading transportation options...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>🚗 Transportation</Text>
          <Text style={styles.subtitle}>Enter transport mode and distance for each trip:</Text>

          {transportEntries.map((entry: TransportationEntry, index: number) => (
            <View key={index} style={styles.entryContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Mode: {transportEntries.length > 1 ? `(${index + 1})  ` : ''}
                </Text>

                <Tooltip
                    isVisible={visibleTooltipIndex === index}
                    content={<Text>Select your transport mode and enter distance traveled.</Text>}
                    placement="bottom"
                    onClose={() => setVisibleTooltipIndex(null)}
                >
                <Pressable onPress={() => setVisibleTooltipIndex(index)}>
                    <Entypo name="help-with-circle" size={18} color="#666" style={{ marginRight: 10 }} />
                </Pressable>
                </Tooltip>

                <View style={styles.labelRightSide}>
                  {transportEntries.length > 1 && (
                    <TouchableOpacity onPress={() => handleRemoveTransport(index)}>
                      <Entypo name="trash" size={20} color="#FF5A5F" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <SelectList
                data={fetchedTransportData.map(t => ({
                  key: t.mode,
                  value: t.mode.replace(/_/g, ' '),
                }))}
                setSelected={(value: string | null) => handleModeChange(value, index)}
                placeholder="Select Mode"
                save="key"
                defaultOption={
                  entry.mode
                    ? { key: entry.mode, value: entry.mode.replace(/_/g, ' ') }
                    : undefined
                }
              />

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g. 35"
                  placeholderTextColor="#888"
                  value={entry.distance}
                  onChangeText={(text) => handleDistanceChange(text, index)}
                />
                <Text style={styles.unit}>km</Text>
              </View>
            </View>
          ))}

          <CustomButton
            title="+ Add Another Transport"
            onPress={handleAddTransport}
            className="my-4"
            bgVariant="secondary"
          />

          <View style={styles.buttonRow}>
            <CustomButton title="⬅️ Back" onPress={onBack} className="w-30" />
            <CustomButton title="Next ➡️" onPress={handleNextStep} className="w-30" />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // textAlign: 'center',
    // color: '#1779AE',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    // textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  entryContainer: {
    marginBottom: 30,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  labelRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  unit: {
    marginLeft: 10,
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
