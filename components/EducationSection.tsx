import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const EducationSection = () => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.card} onPress={() => setVisible(true)}>
        <View style={styles.row}>
          <Feather name="book-open" size={24} color="#2A608F" />
          <Text style={styles.title}>Why does air quality matter?</Text>
        </View>
        <Text style={styles.sub}>
          Learn how pollution affects health, what causes it, and how to protect yourself.
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Why Air Quality Matters</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>
                🌬️ Air quality directly affects your respiratory system. Poor air contains pollutants such as particulate matter (PM2.5), carbon monoxide (CO), and volatile organic compounds (VOCs), which can worsen asthma, bronchitis, and even heart disease.
              </Text>
              <Text style={styles.modalText}>
                🧪 Sources of pollution include vehicle emissions, industrial activities, household products, and indoor cooking. Exposure over time can lead to chronic health conditions.
              </Text>
              <Text style={styles.modalText}>
                🛡️ To reduce your exposure: monitor air quality regularly, use air purifiers indoors, keep plants that purify the air, and avoid outdoor activities when pollution levels are high.
              </Text>
            </ScrollView>
            <Pressable style={styles.closeBtn} onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EducationSection;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E5F4FC',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#2A608F',
    fontSize: 16,
  },
  sub: {
    fontSize: 13,
    color: '#4A6572',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A608F',
    marginBottom: 10,
  },
  modalScroll: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  closeBtn: {
    backgroundColor: '#2A608F',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
