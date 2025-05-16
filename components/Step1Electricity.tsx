import React, { useEffect, useState, Dispatch } from 'react';
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
    LayoutAnimation,
    UIManager,
    Pressable,
} from 'react-native';
import { firestore } from "@/includes/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import CustomButton from "@/components/CustomButton";
import { Entypo } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';

interface Props {
    formData: any;
    setFormData: Dispatch<any>;
    onNext: () => void;
    onBack: () => void;
}

interface Indecator {
    Emission_factor_value: number;
    Indecator_Name: string;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Step1Electricity({ formData, setFormData, onNext, onBack }: Props) {
    const [indecators, setIndecators] = useState<Indecator[]>([]);
    const [visibleTooltipIndex, setVisibleTooltipIndex] = useState<number | null>(null);

    const getUnit = (name: string) => {
        if (name.toLowerCase().includes('electricity')) return 'kWh';
        if (name.toLowerCase().includes('gas')) return 'm³';
        if (name.toLowerCase().includes('water')) return 'm³';
        return 'units';
    };

    useEffect(() => {
        const fetchIndecators = async () => {
            try {
                const footprintCollection = collection(firestore, 'Indecator');
                const q = query(footprintCollection, where('Category ', '==', 'Energy '));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data: Indecator[] = querySnapshot.docs.map(doc => ({
                        Emission_factor_value: doc.data().Emission_factor_value,
                        Indecator_Name: doc.data().Indecator_Name,
                    }));
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setIndecators(data);
                }
            } catch (error) {
                console.error('Error fetching indecators:', error);
            }
        };

        fetchIndecators();
    }, []);

    const calculateElectricityEmission = () => {
        let totalEmission = 0;
        indecators.forEach((indecator) => {
            const usage = parseFloat(formData[indecator.Indecator_Name]) || 0;
            const emissionFactor = indecator.Emission_factor_value || 0;
            totalEmission += usage * emissionFactor;
        });

        setFormData((prev: any) => ({
            ...prev,
            electricityEmission: totalEmission,
        }));
    };

    const handleNext = () => {
        calculateElectricityEmission();
        onNext();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>🏡 Energy Consumption</Text>
                    <Text style={styles.subtitle}>Enter your monthly usage for each utility: </Text>

                    {indecators.map((indecator, index) => {
                        const unit = getUnit(indecator.Indecator_Name);

                        return (
                            <View key={index} style={styles.fieldGroup}>
                                <View style={styles.labelRow}>
                                    <Text style={styles.label}>{indecator.Indecator_Name}</Text>
                                    <Tooltip
                                        isVisible={visibleTooltipIndex === index}
                                        content={<Text>Check your monthly utility bill for this value.</Text>}
                                        placement="bottom"
                                        onClose={() => setVisibleTooltipIndex(null)}
                                    >
                                        <Pressable onPress={() => setVisibleTooltipIndex(index)}>
                                            <Entypo name="help-with-circle" size={18} color="#666" style={styles.helpIcon} />
                                        </Pressable>
                                    </Tooltip>
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        placeholder={`e.g. 1200 (${unit})`}
                                        placeholderTextColor="#888"
                                        value={formData[indecator.Indecator_Name]?.toString() || ''}
                                        onChangeText={(text) =>
                                            setFormData((prev: any) => ({
                                                ...prev,
                                                [indecator.Indecator_Name]: Math.max(0, parseFloat(text) || 0)
                                            }))
                                        }
                                    />
                                    <Text style={styles.unit}>{unit}</Text>
                                </View>
                            </View>
                        );
                    })}

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
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 6,
    },
    helpIcon: {
        marginTop: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 14 : 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    unit: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '500',
        color: '#555',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 30,
    },
});
