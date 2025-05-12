import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';


export default function AboutUs({ onback }: { onback: () => void }) {

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onback}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      {/* <Image
        source={require('@/assets/images/icon.png')} // Replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      /> */}
      <Text style={styles.title}>About Naqa</Text>
      <Text style={styles.description}>
        Naqa is an environmental awareness app designed to help individuals monitor their air quality and track their carbon footprint in real time.
      </Text>
      <Text style={styles.sectionTitle}>🌿 Our Mission</Text>
      <Text style={styles.description}>
        To empower users with the tools and insights they need to live more sustainably by raising awareness of daily environmental impacts.
      </Text>
      <Text style={styles.sectionTitle}>📱 What the App Does</Text>
      <Text style={styles.description}>
        • Measures air quality using connected sensors{'\n'}
        • Calculates carbon footprint from electricity, water, transportation, and consumption{'\n'}
        • Provides tips and education for reducing emissions{'\n'}
        • Helps users stay informed and make greener choices
      </Text>
      <Text style={styles.sectionTitle}>🌍 Join the Movement</Text>
      <Text style={styles.description}>
        Every action matters. By understanding your impact, you take the first step toward a healthier planet for future generations.
      </Text>
      <Text style={styles.footer}>Developed with 💚 by the Naqa Team</Text>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4FAFB',
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 40,
  },
  backButton: {
    backgroundColor: "#1779AE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2A608F',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#145374',
    marginTop: 20,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginTop: 8,
  },
  footer: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
});
