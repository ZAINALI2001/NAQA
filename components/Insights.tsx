import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function Insights({ onback }: { onback: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>    
        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={onback}>
                <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
        </View>  
        <Text style={styles.title}>📊 My Insights</Text>
        <Text style={styles.description}>Understand and improve your environmental impact.</Text>

        <View style={styles.card}>
          <Text style={styles.tip}>💡 Your emissions are 30% below the national average. Great job!</Text>
          <Text style={styles.tip}>🚴 Try biking short distances to save more CO₂!</Text>
          <Text style={styles.tip}>💧 Reducing water usage by 10% saves ~0.3 t CO₂/year.</Text>
        </View>
      </ScrollView>
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FCFF' },
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
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A73E8', marginBottom: 10 },
  description: { fontSize: 16, color: '#444', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    marginBottom: 30,
  },
  tip: {
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  backText: { color: '#fff', fontSize: 16 },
});
