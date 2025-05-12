import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface Props {
    totalEmissionsTonnes: number;
}

export default function StatsComparisonChart({ totalEmissionsTonnes }: Props) {
    const globalAvg = 4.7;
    const saudiAvg = 9.5;

    const labels = ['You', 'Global Avg', 'Saudi Avg'];
    const dataValues = [totalEmissionsTonnes, globalAvg, saudiAvg];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📊 Carbon Footprint Comparison</Text>
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
                    color: (opacity = 1) => `rgba(23, 121, 174, ${opacity})`,
                    labelColor: () => '#333',
                    propsForBackgroundLines: {
                        stroke: '#ccc',
                        strokeDasharray: '',
                    },
                }}
                style={{ borderRadius: 12 }} yAxisLabel={''} yAxisSuffix={''}            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // marginTop: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
});
