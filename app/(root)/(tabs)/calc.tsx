import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import Calculator from '@/components/FootPrint';

interface StartScreenProps {
    onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({onStart}) => {
    const [showCalculator, setShowCalculator] = useState(false);

    if (showCalculator) {
        return <Calculator onback={() => setShowCalculator(false)}/>;
    }

    return (
        <LinearGradient style={styles.container} colors={['#E5F4FC', '#B3DCF0', '#7FBDDE']}>
            {/* <View style={styles.header}>
                <Ionicons name="menu" size={28} color="#1779AE" style={styles.icon}/>
                <Ionicons name="person-circle-outline" size={28} color="#1779AE" style={styles.icon}/>
            </View> */}

            <View style={styles.content}>
                <Image
                    source={require('@/assets/images/img.png')} // Replace with your own image path
                    style={styles.illustration}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Track Your Carbon Footprint</Text>
                <Text style={styles.subtitle}>Start your journey toward a cleaner planet.</Text>

                <TouchableOpacity style={styles.startButton} onPress={() => setShowCalculator(true)}>
                    <Text style={styles.startText}>Get Started →</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 60,
        paddingHorizontal: 24,
        // alignItems: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 90,
        // justifyContent: 'center'
        marginBottom: 60,
    },
    illustration: {
        width: 300,
        height: 300,
        marginBottom: 20
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0D4C73',
        textAlign: 'center',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        color: '#3A6073',
        textAlign: 'center',
        marginBottom: 30
    },
    startButton: {
        backgroundColor: '#1779AE',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        elevation: 2
    },
    startText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default StartScreen;
