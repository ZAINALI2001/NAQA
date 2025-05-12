import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';

interface Props {
    progress: number;
    maxAQI: number;
    label: string;
    color: string;
}

const AQICircularGauge: React.FC<Props> = ({ progress, maxAQI, label, color }) => {
    return (
        <View style={styles.gaugeContainer}>
            <CircularProgress
                size={180}
                width={20}
                fill={(progress / maxAQI) * 100}
                tintColor={color}
                rotation={-90}
                arcSweepAngle={180}
                backgroundColor="#E0E0E0"
            >
                {() => <Text style={[styles.aqiLabel, { color }]}>{label}</Text>}
            </CircularProgress>
            <Text style={styles.aqiValue}>AQI: {progress}</Text>
        </View>
    );
};

export default AQICircularGauge;

const styles = StyleSheet.create({
    gaugeContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    aqiLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    aqiValue: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
});
