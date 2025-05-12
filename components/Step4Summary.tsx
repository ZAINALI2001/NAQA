import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { firestore } from '@/includes/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Props {
    formData: any;
    onBack: () => void;
    onRestart: () => void;
    onNext: () => void;
}

export default function Step4Summary({ formData, onBack, onRestart, onNext }: Props) {
    const [energyKeys, setEnergyKeys] = useState<string[]>([]);
    const [generalKeys, setGeneralKeys] = useState<string[]>([]);

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const colRef = collection(firestore, 'Indecator');
                const energyQuery = query(colRef, where('Category ', '==', 'Energy '));
                const generalQuery = query(colRef, where('Category ', '==', 'General'));

                const [energySnap, generalSnap] = await Promise.all([
                    getDocs(energyQuery),
                    getDocs(generalQuery),
                ]);

                const energy = energySnap.docs.map(doc => doc.data().Indecator_Name.trim());
                const general = generalSnap.docs.map(doc => doc.data().Indecator_Name.trim());

                setEnergyKeys(energy);
                setGeneralKeys(general);
            } catch (err) {
                console.error('Error fetching indicators:', err);
            }
        };

        fetchKeys();
    }, []);

    const getFilteredItems = (keys: string[]) => {
        return Object.keys(formData)
            .filter((key) =>
                keys.includes(key.trim()) &&
                typeof formData[key] === 'number' &&
                formData[key] > 0
            )
            .map((key) => ({
                key,
                value: formData[key]
            }));
    };

    const energyItems = getFilteredItems(energyKeys);
    const generalItems = getFilteredItems(generalKeys);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>🎉 Summary</Text>

            {/* Time Period */}
            {(formData.fromDate || formData.toDate) && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🗓️ Time Period:</Text>
                    {formData.fromDate && (
                        <View style={styles.itemRow}>
                            <Text style={styles.itemName}>From:</Text>
                            <Text style={styles.itemValue}>{formData.fromDate}</Text>
                        </View>
                    )}
                    {formData.toDate && (
                        <View style={styles.itemRow}>
                            <Text style={styles.itemName}>To:</Text>
                            <Text style={styles.itemValue}>{formData.toDate}</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Energy Section */}
            {energyItems.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔌 Energy Consumption:</Text>
                    {energyItems.map(({ key, value }) => (
                        <View key={key} style={styles.itemRow}>
                            <Text style={styles.itemName}>{key}</Text>
                            <Text style={styles.itemValue}>{value}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Transportation Section */}
            {formData.transportation &&
                Array.isArray(formData.transportation) &&
                formData.transportation.some((t: any) => t.mode && t.distance) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🚗 Transportation:</Text>
                        {formData.transportation.map((entry: any, index: number) =>
                            entry.mode && entry.distance ? (
                                <View key={index} style={styles.itemRow}>
                                    <Text style={styles.itemName}>{entry.mode.replace(/_/g, ' ')}</Text>
                                    <Text style={styles.itemValue}>{entry.distance} km</Text>
                                </View>
                            ) : null
                        )}
                    </View>
                )}

            {/* General Consumption Section */}
            {generalItems.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🛒 General Consumption:</Text>
                    {generalItems.map(({ key, value }) => (
                        <View key={key} style={styles.itemRow}>
                            <Text style={styles.itemName}>{key}</Text>
                            <Text style={styles.itemValue}>{value}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Buttons */}
            <Button title="📊 Calculate" onPress={onNext}/>
            {/* <CustomButton title="📊 Calculate" onPress={onNext} className="w-full my-3" /> */}
            <View style={styles.buttonRow}>
                <CustomButton title="⬅️ Back" onPress={onBack} className="w-auto" />
                <CustomButton title="🔄 Restart" onPress={onRestart} className="w-auto" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        // textAlign: 'center',
        // color: '#1779AE',
    },
    section: {
        width: '100%',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    itemName: {
        fontSize: 16,
        color: '#444',
    },
    itemValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
});
