import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth, firestore as dbFirestore } from '@/includes/FirebaseConfig';
import AQISpeedometerDial from '@/components/AQISpeedometerDial';
import SmartTipBanner from '@/components/SmartTipBanner';
import EducationSection from '@/components/EducationSection';
import AirFactCarousel from '@/components/AirFactCarousel';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import moment from 'moment';

interface AQIThreshold {
  Gas_Name: string;
  C_low: number;
  C_high: number;
  I_low: number;
  I_high: number;
}

export default function Home() {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [temp, setTemp] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [CO2, setCO2] = useState<number | null>(null);
  const [CO, setCO] = useState<number | null>(null);
  const [VOC, setVOC] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [aqiThresholds, setAqiThresholds] = useState<AQIThreshold[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch user name
  useEffect(() => {
    if (!user) return;
    const fetchUserName = async () => {
      const docRef = doc(dbFirestore, 'users', user.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const userData = snapshot.data();
        setName(userData.name || '');
      }
    };
    fetchUserName();
  }, [user]);

  // Fetch AQI thresholds
  useEffect(() => {
    const fetchThresholds = async () => {
      const snapshot = await getDocs(collection(dbFirestore, 'AQI'));
      const thresholds: AQIThreshold[] = snapshot.docs.map(doc => doc.data() as AQIThreshold);
      setAqiThresholds(thresholds);
    };
    fetchThresholds();
  }, []);

  // Firebase sensor data
  useEffect(() => {
    const dataRef = ref(db, '/AirQuality');
    let lastTimestamp = 0;
    let heartbeatChecker: ReturnType<typeof setInterval>;

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) return;

      // Always use this to determine if device is connected
      const now = Date.now();
      const heartbeatTime = val.timestamp ? val.timestamp * 1000 : 0;
      lastTimestamp = heartbeatTime;

      // Check if full sensor data is available
      const lastDataPushTime = val.last_data_push ? val.last_data_push * 1000 : 0;

      if (val.temp && val.humid && val.CO2_ppm && val.CO_ppm && val.VOC && lastDataPushTime > 0) {
        setTemp(Math.round(val.temp));
        setHumidity(Math.round(val.humid));
        setCO2(Math.round(val.CO2_ppm));
        setCO(Math.round(val.CO_ppm));
        setVOC(Math.round(val.VOC));

        const aqi = calculateAQI(val.CO2_ppm, val.CO_ppm, val.VOC);
        setProgress(aqi);
        setLastUpdated(moment(lastDataPushTime).format('h:mm A'));
      }
    });

    // Heartbeat checker — only checks if timestamp is fresh
    heartbeatChecker = setInterval(() => {
      const now = Date.now();
      const diff = now - lastTimestamp;
      setDeviceConnected(diff < 90000); // 90 seconds tolerance
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(heartbeatChecker);
    };
  }, [aqiThresholds]);




  const calculateAQI = (co2: number, co: number, voc: number): number => {
    const getAQIFromRange = (value: number, gas: string): number => {
      const ranges = aqiThresholds.filter(item => item.Gas_Name === gas);
      for (let range of ranges) {
        if (value >= range.C_low && value <= range.C_high) {
          return (
            ((value - range.C_low) / (range.C_high - range.C_low)) *
            (range.I_high - range.I_low) +
            range.I_low
          );
        }
      }
      return 0;
    };

    const co2AQI = getAQIFromRange(co2, 'CO2');
    const coAQI = getAQIFromRange(co, 'CO');
    const vocAQI = getAQIFromRange(voc, 'VOC');

    return Math.round(Math.max(co2AQI, coAQI, vocAQI));
  };

  const getAQILabel = (value: number) => {
    if (value <= 50) return { label: 'Very Good', emoji: '🟢', tip: 'Enjoy the fresh air!' };
    if (value <= 100) return { label: 'Good', emoji: '🔵', tip: 'Keep windows open.' };
    if (value <= 200) return { label: 'Fair', emoji: '🟡', tip: 'Limit outdoor activity.' };
    if (value <= 300) return { label: 'Poor', emoji: '🟠', tip: 'Avoid outdoor exposure.' };
    if (value <= 400) return { label: 'Very Poor', emoji: '🔴', tip: 'Stay indoors with air purifiers.' };
    return { label: 'Hazardous', emoji: '🟣', tip: 'Health alert! Remain inside.' };
  };

  const AQI = getAQILabel(progress);

  const SensorBox = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View style={styles.sensorBox}>
      <Text style={styles.sensorValue}>{icon} {value}</Text>
      <Text style={styles.sensorLabel}>{label}</Text>
    </View>
  );

  if (!user) {
    return (
      <LinearGradient style={styles.container} colors={['#E5F4FC', '#B3DCF0', '#7FBDDE']}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <Animated.View entering={FadeInUp.delay(100)} style={styles.headerCard}>
            <Text style={styles.header}>👋 Welcome to Naqa</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200)} style={styles.card}>
            <Text style={styles.cardTitle}>What is Naqa?</Text>
            <Text style={styles.cardText}>
              Naqa is your smart air companion. It monitors CO₂, CO, VOC, humidity, and temperature in real-time.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300)} style={styles.card}>
            <Text style={styles.cardTitle}>Why Air Quality Matters</Text>
            <Text style={styles.cardText}>
              Clean air improves your focus, sleep, and overall health. Naqa helps you breathe better every day.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.tipCard}>
            <Text style={styles.cardTitle}>Tips for Healthier Air</Text>
            <Text style={styles.cardText}>• Open windows daily</Text>
            <Text style={styles.cardText}>• Avoid indoor smoking</Text>
            <Text style={styles.cardText}>• Add indoor plants 🌿</Text>
          </Animated.View>

          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push("/(auth)/sign-in")}>
            <Text style={styles.ctaText}>🔐 Sign In to Begin</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#E5F4FC', '#B3DCF0', '#7FBDDE']}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Hi, {name || 'User'} 👋</Text>
              <Text style={styles.subtext}>Here's your air quality today</Text>
            </View>
            <Ionicons
              name={deviceConnected ? 'checkmark-circle' : 'close-circle'}
              size={28}
              color={deviceConnected ? 'green' : 'red'}
            />
          </View>

          {deviceConnected ? (
            <>
              <AQISpeedometerDial value={progress} max={500} />
              <Animated.View style={styles.summaryCard} entering={FadeInUp.delay(200)}>
                <Text style={styles.summaryEmoji}>{AQI.emoji} {AQI.label}</Text>
                <Text style={styles.summaryText}>{AQI.tip}</Text>
                <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
              </Animated.View>

              <SmartTipBanner />

              <View style={styles.sensorRow}>
                <SensorBox label="Temperature" value={temp !== null ? `${temp}°C` : 'N/A'} icon="🌡️" />
                <SensorBox label="Humidity" value={humidity !== null ? `${humidity}%` : 'N/A'} icon="💧" />
              </View>
            </>
          ) : (
            <Animated.View entering={FadeInUp.delay(200)} style={styles.connectionGuide}>
              <Text style={styles.info}>⚠️ No device connected</Text>
              <Text style={styles.guideText}>To connect your device:</Text>
              <Text style={styles.guideStep}>1. Turn on the ESP32 device</Text>
              <Text style={styles.guideStep}>2. Connect to "Naqa Setup" Wi-Fi</Text>
              <Text style={styles.guideStep}>3. Open the setup portal</Text>
              <Text style={styles.guideStep}>4. Enter your network credentials</Text>
              <Text style={styles.guideStep}>5. Wait for real-time data to show</Text>
            </Animated.View>
          )}

          <AirFactCarousel />
          <EducationSection />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
  greeting: { fontSize: 20, fontWeight: '700', color: '#2A608F' },
  subtext: { fontSize: 14, color: '#555', marginTop: 2 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#2A608F' },
  summaryCard: { marginVertical: 16, padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  summaryEmoji: { fontSize: 22, fontWeight: 'bold', color: '#2A608F' },
  summaryText: { fontSize: 14, color: '#444', textAlign: 'center', marginTop: 6 },
  lastUpdated: { fontSize: 12, color: '#888', marginTop: 6 },
  sensorRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 20 },
  sensorBox: {
    width: '48%',
    backgroundColor: '#ffffffee',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sensorValue: { fontSize: 20, fontWeight: 'bold', color: '#2A608F', marginBottom: 6 },
  sensorLabel: { fontSize: 13, color: '#4A6572' },
  connectionGuide: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginVertical: 10 },
  info: { fontSize: 16, fontWeight: '600', color: '#B00020', marginBottom: 12 },
  guideText: { fontSize: 15, fontWeight: '600', color: '#2A608F', marginBottom: 8 },
  guideStep: { fontSize: 14, color: '#333', marginBottom: 4 },
  ctaButton: { backgroundColor: '#2A608F', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30, alignSelf: 'center', marginTop: 20 },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  headerCard: { padding: 16, borderRadius: 20, alignItems: 'center', marginBottom: 14 },
  card: {
    backgroundColor: '#ffffffee',
    padding: 16,
    borderRadius: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipCard: {
    backgroundColor: '#F0FAF6',
    padding: 16,
    borderRadius: 18,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#38B000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#2A608F' },
  cardText: { fontSize: 14, color: '#444', lineHeight: 20, marginVertical: 2 },
});
