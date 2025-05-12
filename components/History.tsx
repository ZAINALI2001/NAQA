import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
  Modal, Pressable, ActivityIndicator
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from '@/includes/FirebaseConfig';
import { format } from 'date-fns';

const classificationLabels = ['Excellent', 'Good', 'Moderate', 'Poor'];

export default function History({ onback }: { onback: () => void }) {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  const user = auth.currentUser;

  const getClassification = (value: number) => {
    if (value < 3) return 'Excellent';
    if (value < 7) return 'Good';
    if (value < 12) return 'Moderate';
    return 'Poor';
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!user) return;

        const q = query(
          collection(firestore, 'Carbon_footprint'),
          where('User_ID', '==', user.uid)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => {
          const item = { id: doc.id, ...doc.data() };
          item.classification = getClassification(parseFloat(item.Calculated_value || '0'));
          item.TimestampLabel = item.Timestamp?.toDate
            ? format(item.Timestamp.toDate(), 'MMMM yyyy')
            : 'Unknown';
          return item;
        });

        // Sort newest first
        const sorted = data.sort((a, b) => {
          const aTime = a.Timestamp?.toDate?.() || 0;
          const bTime = b.Timestamp?.toDate?.() || 0;
          return bTime - aTime;
        });

        const months = [...new Set(sorted.map((item) => item.TimestampLabel))];

        setHistoryData(sorted);
        setFilteredData(sorted);
        setAvailableMonths(months);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const applyFilters = () => {
    let result = [...historyData];
    if (selectedMonth) {
      result = result.filter((item) => item.TimestampLabel === selectedMonth);
    }
    if (selectedClass) {
      result = result.filter((item) => item.classification === selectedClass);
    }
    setFilteredData(result);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSelectedMonth(null);
    setSelectedClass(null);
    setFilteredData(historyData);
    setShowFilterModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={onback}>
                <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.title}>📜 My History</Text>
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <Ionicons name="filter" size={26} color="#1779AE" />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>Your past carbon footprint submissions are shown below.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#1779AE" style={{ marginTop: 40 }} />
        ) : filteredData.length === 0 ? (
          <Text style={styles.empty}>No matching records found.</Text>
        ) : (
          filteredData.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>
                Submitted on:{" "}
                {item.Timestamp?.toDate ? format(item.Timestamp.toDate(), 'PPpp') : 'Unknown'}
              </Text>
              <Text style={styles.cardDetail}>From: {item.fromDate}</Text>
              <Text style={styles.cardDetail}>To: {item.toDate}</Text>
              <Text style={styles.cardDetail}>Total Emissions: {item.Calculated_value} t CO₂e</Text>
              <Text style={styles.cardDetail}>Electricity: {item.electricityEmission} kg</Text>
              <Text style={styles.cardDetail}>Transport: {item.transportationEmission} kg</Text>
              <Text style={styles.cardDetail}>General: {item.generalEmission} kg</Text>
              <Text style={styles.cardDetail}>Classification: {item.classification}</Text>
            </View>
          ))
        )}
        
      </ScrollView>

      {/* Modal Filter */}
      <Modal visible={showFilterModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🔎 Filter History</Text>

            {/* Month Picker */}
            <Text style={styles.modalLabel}>Month:</Text>
            {availableMonths.map((month) => (
              <Pressable
                key={month}
                style={[
                  styles.modalOption,
                  selectedMonth === month && styles.modalSelected,
                ]}
                onPress={() => setSelectedMonth(month)}
              >
                <Text>{month}</Text>
              </Pressable>
            ))}

            {/* Classification Picker */}
            <Text style={[styles.modalLabel, { marginTop: 15 }]}>Classification:</Text>
            {classificationLabels.map((cls) => (
              <Pressable
                key={cls}
                style={[
                  styles.modalOption,
                  selectedClass === cls && styles.modalSelected,
                ]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text>{cls}</Text>
              </Pressable>
            ))}

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={applyFilters} style={styles.modalApply}>
                <Text style={{ color: '#fff' }}>Apply Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearFilters} style={styles.modalClear}>
                <Text style={{ color: '#1779AE' }}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1779AE' },
  description: { fontSize: 16, color: '#444', marginBottom: 20, paddingHorizontal: 20 },
  empty: { fontSize: 16, textAlign: 'center', marginTop: 40, color: '#888' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1A73E8',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  cardDetail: { fontSize: 14, color: '#555', marginBottom: 3 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '100%',
},
backButton: {
    backgroundColor: '#1779AE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
},
  // backButton: {
  //   backgroundColor: '#1779AE',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: 14,
  //   borderRadius: 12,
  //   marginHorizontal: 60,
  //   marginBottom: 40,
  //   gap: 8,
  // },
  backText: { color: '#fff', fontSize: 16 },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1779AE',
  },
  modalLabel: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: '600',
    color: '#333',
  },
  modalOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f3f3',
    marginTop: 6,
  },
  modalSelected: {
    backgroundColor: '#CFE8FF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalApply: {
    backgroundColor: '#1779AE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalClear: {
    backgroundColor: '#EAF4FB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
