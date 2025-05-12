import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const facts = [
  '🌍 9 out of 10 people breathe polluted air.',
  '🏠 Indoor air quality can be worse than outdoor.',
  '🧪 VOCs come from paints, sprays, and cleaners.',
  '🌳 Trees can help absorb CO₂ and clean the air.'
];

const AirFactCarousel = () => {
  const [index, setIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const cycle = setInterval(() => {
      setIndex((prev) => (prev + 1) % facts.length);
    }, 6000);
    return () => clearInterval(cycle);
  }, []);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.fact}>{facts[index]}</Text>
    </Animated.View>
  );
};

export default AirFactCarousel;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D1EAF2',
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  fact: {
    fontSize: 14,
    color: '#2A608F',
    textAlign: 'center',
  },
});
