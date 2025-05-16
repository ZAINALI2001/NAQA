import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    classification: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
}

const tipsMap: Record<Props['classification'], string[]> = {
    Excellent: [
        "🎉 Great job! You're an eco-champion.",
        "Maintain your low emissions by using energy-efficient devices.",
        "Spread awareness and help others reduce their footprint too."
    ],
    Good: [
        "👍 You're doing well! Just a little more effort.",
        "Consider reducing unnecessary car trips.",
        "Try plant-based meals once or twice a week."
    ],
    Moderate: [
        "⚠️ You’re on the right path, but there's room to improve.",
        "Reduce single-use plastics and waste.",
        "Optimize your home’s electricity and water usage."
    ],
    Poor: [
        "🚨 Your footprint is high — but every action counts!",
        "Use public transportation or carpool when possible.",
        "Upgrade to energy-saving appliances and unplug unused electronics.",
        "Track and minimize online shopping and overconsumption."
    ]
};

export default function EnvironmentalTips({ classification }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌿 Tips for You</Text>
            {tipsMap[classification].map((tip, index) => (
                <Text key={index} style={styles.tip}>• {tip}</Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        marginTop: 20,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: '#F9F9F9',
        borderColor: '#DDD',

    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2A608F',
    // alignSelf: 'center',
    },
    tip: {
        fontSize: 15,
        color: '#444',
        marginBottom: 6,
    },
});
