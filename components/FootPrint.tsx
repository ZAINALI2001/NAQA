import { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import Start from '@/components/StartPeriodStep';
import Step1Electricity from '@/components/Step1Electricity';
import Step2Transportation from '@/components/Step2Transportation';
import Step3Global from '@/components/Step3Global';
import Step4Summary from '@/components/Step4Summary';
import Step5Final from '@/components/Step5Final';

interface CalculatorProps {
    onback: () => void;
}

const Calculator = ({ onback }: CalculatorProps) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({});

    const onNext = () => setStep((prev) => prev + 1);
    const onBack = () => setStep((prev) => prev - 1);
    const onRestart = () => {
        setFormData({});
        setStep(1);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={onback}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Step Indicator */}
            {step < 6 && (
                <View style={styles.stepIndicatorContainer}>
                    {[1, 2, 3, 4, 5].map((item) => (
                        <View
                            key={item}
                            style={[styles.stepBox, (step === item || step > item) && styles.activeStepBox]}
                        >
                            <Text style={[styles.stepText, (step === item || step > item) && styles.activeStepText]}>
                                {item}
                                {/*{step > item ? '✓' : item}*/}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Step Pages */}
            {step === 1 && <Start formData={formData} setFormData={setFormData} onNext={onNext} />}
            {step === 2 && (
                <Step1Electricity
                    formData={formData}
                    setFormData={setFormData}
                    onNext={onNext}
                    onBack={onBack}
                />
            )}
            {step === 3 && (
                <Step2Transportation
                    formData={formData}
                    setFormData={setFormData}
                    onNext={onNext}
                    onBack={onBack}
                />
            )}
            {step === 4 && (
                <Step3Global
                    formData={formData}
                    setFormData={setFormData}
                    onNext={onNext}
                    onBack={onBack}
                />
            )}
            {step === 5 && (
                <Step4Summary
                    formData={formData}
                    onBack={onBack}
                    onRestart={onRestart}
                    onNext={onNext}
                />
            )}
            {step === 6 && <Step5Final formData={formData} onRestart={onRestart} onBack={onBack}/>}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E3F2F9',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: '100%',
    },
    backButton: {
        backgroundColor: '#1779AE',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    stepBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#B0BEC5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStepBox: {
        backgroundColor: '#1779AE',
    },
    stepText: {
        color: '#455A64',
        fontWeight: 'bold',
        fontSize: 18,
    },
    activeStepText: {
        color: '#FFFFFF',
    },
});

export default Calculator;
