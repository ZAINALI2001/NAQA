import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SmartTipBanner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💡</Text>
      <Text style={styles.tip}>Keep your windows open when the air quality is good to refresh indoor air.</Text>
    </View>
  );
};

export default SmartTipBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffffee',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  emoji: {
    fontSize: 22,
    marginRight: 8,
  },
  tip: {
    fontSize: 14,
    color: '#2A608F',
    flexShrink: 1,
  },
});
