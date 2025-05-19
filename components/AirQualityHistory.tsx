import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
  ActivityIndicator, Pressable, Modal, TextInput, Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from '@/includes/FirebaseConfig';
import { format, parse } from 'date-fns';
import { BarChart } from 'react-native-chart-kit';

type GasReading = {
  Gas_Name: string;
  Real_time_data: number;
};

const gasTypes = ['All', 'CO2', 'CO', 'VOC'];

export default function AirQualityHistory({ onback }: { onback: () => void }) {
  const [groupedHistory, setGroupedHistory] = useState<Record<string, GasReading[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedGas, setSelectedGas] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [minValue, setMinValue] = useState<string>('0');

  useEffect(() => {
  const fetchData = async () => {
    try {
      const snapshot = await getDocs(query(collection(firestore, 'Air_quality')));
      const grouped: Record<string, GasReading[]> = {};
      const monthsSet = new Set<string>();

      snapshot.forEach(doc => {
        const data = doc.data();
        const { Date_Time, Gas_Name, Real_time_data } = data || {};
        if (!Date_Time || !Gas_Name || Real_time_data == null) return;

        const parsedTime = parse(Date_Time, "dd MMMM yyyy 'at' HH:mm:ss", new Date());

        if (isNaN(parsedTime.getTime())) {
          console.warn("Invalid date format in document:", data);
          return;
        }

        const label = parsedTime.toISOString();
        const monthLabel = format(parsedTime, 'MMMM yyyy');
        monthsSet.add(monthLabel);

        if (!grouped[label]) grouped[label] = [];
        grouped[label].push({ Gas_Name, Real_time_data });
      });

      const sorted = Object.entries(grouped).sort(
        (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
      );

      setGroupedHistory(Object.fromEntries(sorted));
      setAvailableMonths(['All', ...Array.from(monthsSet)]);
      setLoading(false);
    } catch (err) {
      console.error("❌ Failed to fetch from Firestore:", err);
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const filterData = (): [string, GasReading[]][] => {
    const threshold = parseFloat(minValue) || 0;

    return Object.entries(groupedHistory).filter(([date, readings]) => {
      const matchMonth = selectedMonth === 'All' || format(new Date(date), 'MMMM yyyy') === selectedMonth;
      const matchGas = selectedGas === 'All' || readings.some(r => r.Gas_Name === selectedGas);
      const matchSearch = date.toLowerCase().includes(searchText.toLowerCase());
      const matchValue = readings.some(r =>
        (selectedGas === 'All' || r.Gas_Name === selectedGas) &&
        r.Real_time_data >= threshold
      );
      return matchMonth && matchGas && matchSearch && matchValue;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onback}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <Feather name="filter" size={24} color="#1779AE" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>🧾 Sensor History</Text>
        <TextInput
          placeholder="Search by date or keyword..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#1779AE" style={{ marginTop: 40 }} />
        ) : filterData().length === 0 ? (
          <Text style={styles.empty}>No matching records found.</Text>
        ) : (
          filterData().map(([date, gases], index) => {
            const filteredGases = gases.filter(
              (g) =>
                (selectedGas === 'All' || g.Gas_Name === selectedGas) &&
                g.Real_time_data >= (parseFloat(minValue) || 0)
            );

            return (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>🕒 {date}</Text>
                {filteredGases.map((gas, idx) => (
                  <Text key={idx} style={styles.cardDetail}>
                    {gas.Gas_Name}: {gas.Real_time_data} {gas.Gas_Name === 'VOC' ? 'ppb' : 'ppm'}
                  </Text>
                ))}

                <BarChart
                  data={{
                    labels: filteredGases.map(g => g.Gas_Name),
                    datasets: [{ data: filteredGases.map(g => g.Real_time_data) }],
                  }}
                  width={Dimensions.get('window').width - 60}
                  height={180}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: () => '#2A608F',
                    labelColor: () => '#555',
                    barPercentage: 0.6,
                  }}
                  style={{ marginTop: 12, borderRadius: 12 }}
                  fromZero
                />
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Filter Modal (unchanged) */}
      {/* ... rest of your modal code ... */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1779AE',
    textAlign: 'center',
    marginTop: 10,
  },
  searchInput: {
    margin: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
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
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#2A608F' },
  cardDetail: { fontSize: 14, color: '#555', marginBottom: 3 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    backgroundColor: '#1779AE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
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
  modalLabel: { fontSize: 14, marginTop: 10, fontWeight: '600', color: '#333' },
  modalOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f3f3',
    marginTop: 6,
  },
  modalSelected: { backgroundColor: '#CFE8FF' },
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
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6,
    backgroundColor: '#fff',
  },
});
