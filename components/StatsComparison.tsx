import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    totalEmissionsTonnes: number;
}

export default function StatsComparison({ totalEmissionsTonnes }: Props) {
    const globalAvg = 4.7;
    const saudiAvg = 9.5;

    const getClassification = (value: number): string => {
        if (value < 3) return '🌱 Excellent';
        if (value < 7) return '✅ Good';
        if (value < 12) return '⚠️ Moderate';
        return '🚨 Poor';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Environmental Ranking</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Your Footprint:</Text>
                <Text style={styles.value}>{totalEmissionsTonnes} Tonnes CO₂e</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Global Average:</Text>
                <Text style={styles.value}>{globalAvg} Tonnes CO₂e</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Saudi Arabia Average:</Text>
                <Text style={styles.value}>{saudiAvg} Tonnes CO₂e</Text>
            </View>

            {/* <View style={styles.classificationBox}>
                <Text style={styles.classificationLabel}>Your Classification:</Text>
                <Text style={styles.classificationText}>{getClassification(totalEmissionsTonnes)}</Text>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#F1F8E9',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#33691E',
        alignSelf: 'center',
    },
    section: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    classificationBox: {
        marginTop: 15,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#E0F7FA',
        alignItems: 'center',
    },
    classificationLabel: {
        fontSize: 16,
        color: '#00796B',
    },
    classificationText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#004D40',
        marginTop: 5,
    },
});
