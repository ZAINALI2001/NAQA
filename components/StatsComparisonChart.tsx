import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface Props {
  totalEmissionsTonnes: number;
  periodDays: number;
}

export default function StatsComparisonChart({ totalEmissionsTonnes, periodDays }: Props) {
  const globalAnnualAvg = 4.7;
  const saudiAnnualAvg = 9.5;
  const scale = periodDays / 365;

  const globalAvgScaled = parseFloat((globalAnnualAvg * scale).toFixed(2));
  const saudiAvgScaled = parseFloat((saudiAnnualAvg * scale).toFixed(2));

  const labels = ['You', 'Global Avg', 'Saudi Avg'];
  const dataValues = [totalEmissionsTonnes, globalAvgScaled, saudiAvgScaled];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Comparison for {periodDays}-Day Period</Text>
      <BarChart
        data={{
          labels,
          datasets: [{ data: dataValues }],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        fromZero
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(27, 94, 32, ${opacity})`, // Dark green tone
          labelColor: () => '#333',
          propsForBackgroundLines: {
            stroke: '#ccc',
            strokeDasharray: '',
          },
        }}
        style={{ borderRadius: 12 }}
        yAxisLabel={''}
        yAxisSuffix={''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2A608F',
    alignSelf: 'center',
  },
});
