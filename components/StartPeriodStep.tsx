import React, { useState, Dispatch } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '@/components/CustomButton';

interface Props {
  formData: any;
  setFormData: Dispatch<any>;
  onNext: () => void;
}

export default function StartPeriodStep({ formData, setFormData, onNext }: Props) {
  const isAndroid = Platform.OS === 'android';

  const [fromDate, setFromDate] = useState<Date>(formData.fromDate ? new Date(formData.fromDate) : new Date());
  const [toDate, setToDate] = useState<Date>(formData.toDate ? new Date(formData.toDate) : new Date());

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleNext = () => {
    if (fromDate > toDate) {
      alert("Start date must be before end date.");
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
    }));

    onNext();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏳ Time Period</Text>
      <Text style={styles.subtitle}>Please select the time period you want to calculate: </Text>

      <ScrollView keyboardShouldPersistTaps="handled">
        {/* From Date */}
        <Text style={styles.label}>From:</Text>
        <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>{fromDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>

        {isAndroid && showFromPicker && (
          <Modal transparent visible animationType="fade" onRequestClose={() => setShowFromPicker(false)}>
            <TouchableWithoutFeedback onPress={() => setShowFromPicker(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.pickerContainer}>
                    {showFromPicker && (
                      <DateTimePicker
                        key="from"
                        value={fromDate}
                        mode="date"
                        display="default"
                        themeVariant="light"
                        onChange={(_, selectedDate) => {
                          setShowFromPicker(false);
                          if (selectedDate) setFromDate(selectedDate);
                        }}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

        {!isAndroid && showFromPicker && (
          <View key="ios-from">
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="spinner"
              themeVariant="light"
              onChange={(_, selectedDate) => {
                setShowFromPicker(false);
                if (selectedDate) setFromDate(selectedDate);
              }}
            />
          </View>
        )}

        {/* To Date */}
        <Text style={styles.label}>To:</Text>
        <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>{toDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>

        {isAndroid && showToPicker && (
          <Modal transparent visible animationType="fade" onRequestClose={() => setShowToPicker(false)}>
            <TouchableWithoutFeedback onPress={() => setShowToPicker(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.pickerContainer}>
                    {showToPicker && (
                      <DateTimePicker
                        key="to"
                        value={toDate}
                        mode="date"
                        display="default"
                        themeVariant="light"
                        onChange={(_, selectedDate) => {
                          setShowToPicker(false);
                          if (selectedDate) setToDate(selectedDate);
                        }}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

        {!isAndroid && showToPicker && (
          <View key="ios-to">
            <DateTimePicker
              value={toDate}
              mode="date"
              display="spinner"
              themeVariant="light"
              onChange={(_, selectedDate) => {
                setShowToPicker(false);
                if (selectedDate) setToDate(selectedDate);
              }}
            />
          </View>
        )}

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <CustomButton title="Next ➡" onPress={handleNext} className="w-full" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
});
