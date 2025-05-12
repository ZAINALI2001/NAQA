// components/SensorBox.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SensorBox = ({ icon, label, value }) => (
    <View style={styles.sensorBox}>
        {icon}
        <Text style={styles.sensorValue}>{value}</Text>
        <Text style={styles.sensorLabel}>{label}</Text>
    </View>
);

export default SensorBox;

const styles = StyleSheet.create({
    sensorBox: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        width: '30%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    sensorValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2A608F',
        marginTop: 5,
    },
    sensorLabel: {
        fontSize: 12,
        color: '#2A608F',
    },
});
