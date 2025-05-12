import React, { useState, useEffect, Dispatch } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    Pressable,
} from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/includes/FirebaseConfig';
import CustomButton from '@/components/CustomButton';
import { Entypo } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';

interface Props {
    formData: any;
    setFormData: Dispatch<any>;
    onNext: () => void;
    onBack: () => void;
}

interface GlobalItem {
    Indecator_Name: string;
    Emission_factor_value: number;
}

export default function Step3Global({ formData, setFormData, onNext, onBack }: Props) {
    const [globalItems, setGlobalItems] = useState<GlobalItem[]>([]);
    const [visibleTooltipIndex, setVisibleTooltipIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchGlobalItems = async () => {
            try {
                const colRef = collection(firestore, 'Indecator');
                const q = query(colRef, where('Category ', '==', 'General'));
                const snapshot = await getDocs(q);
                const data: GlobalItem[] = snapshot.docs.map(doc => ({
                    Indecator_Name: doc.data().Indecator_Name.trim(),
                    Emission_factor_value: doc.data().Emission_factor_value,
                }));
                setGlobalItems(data);
            } catch (error) {
                console.error("Error fetching global indicators:", error);
            }
        };
        fetchGlobalItems();
    }, []);

    const calculateGlobalEmission = () => {
        let total = 0;
        globalItems.forEach((item) => {
            const value = parseFloat(formData[item.Indecator_Name]) || 0;
            total += value * item.Emission_factor_value;
        });
        setFormData((prev: any) => ({
            ...prev,
            generalEmission: total,
        }));
    };

    const handleNext = () => {
        calculateGlobalEmission();
        onNext();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>🛒 General Consumption</Text>
                    <Text style={styles.subtitle}>Please enter the number of items purchased during the selected period:</Text>

                    {globalItems.map((item, index) => (
                        <View key={index} style={styles.fieldGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>{item.Indecator_Name}</Text>
                                <Tooltip
                                    isVisible={visibleTooltipIndex === index}
                                    content={<Text>Enter the number of {item.Indecator_Name.toLowerCase()} you bought. </Text>}
                                    placement="bottom"
                                    onClose={() => setVisibleTooltipIndex(null)}
                                >
                                    <Pressable onPress={() => setVisibleTooltipIndex(index)}>
                                        <Entypo name="help-with-circle" size={18} color="#666" />
                                    </Pressable>
                                </Tooltip>
                            </View>

                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="e.g. 3"
                                value={formData[item.Indecator_Name]?.toString() || ''}
                                onChangeText={(text) =>
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        [item.Indecator_Name]: Math.max(0, parseFloat(text) || 0)
                                    }))
                                }
                            />
                        </View>
                    ))}

                    <View style={styles.buttonRow}>
                        <CustomButton title="⬅️ Back" onPress={onBack} className="w-30" />
                        <CustomButton title="Next ➡️" onPress={handleNext} className="w-30" />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        // textAlign: 'center',
        // color: '#1779AE',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        // textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    fieldGroup: {
        marginBottom: 25,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        fontSize: 16,
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
