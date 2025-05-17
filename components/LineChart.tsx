import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function AQILineChart({ labels, data }: { labels: string[]; data: number[] }) {
  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Past CO₂ Readings</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data }]
        }}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix=" ppm"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#e6f7ff',
          backgroundGradientTo: '#b3e0ff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
          labelColor: () => '#555',
        }}
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}
