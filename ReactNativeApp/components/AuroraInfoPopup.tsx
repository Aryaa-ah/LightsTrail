import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AuroraPopupProps {
  open: boolean;
  onClose: () => void;
}

const AuroraPopup: React.FC<AuroraPopupProps> = ({ open, onClose }) => {
  const { width } = Dimensions.get('window');
  const isMobile = width <= 600;

  return (
    <Modal
      isVisible={open}
      onBackdropPress={onClose}
      backdropOpacity={0.7}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}
    >
      <View style={[styles.content, { width: isMobile ? '90%' : '60%' }]}>
        <View style={styles.closeRow}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          How We Calculate Aurora Probability
        </Text>

        <ScrollView>
          <Text style={styles.description}>
            We use several natural and environmental factors to estimate the likelihood of seeing an aurora:
          </Text>

          {listItems.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.itemText}>
                <Text style={styles.bold}>{item.title}</Text>{item.description}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const listItems = [
  { title: 'Geomagnetic Activity (KP Index): ', description: 'Stronger activity increases the chances.' },
  { title: 'Magnetic Field Orientation (Bz): ', description: 'Certain orientations make auroras more likely.' },
  { title: 'Solar Wind Speed: ', description: 'Faster winds improve aurora conditions.' },
  { title: 'Temperature: ', description: 'Cold nights help with visibility.' },
  { title: 'Precipitation: ', description: 'Less rain or snow improves chances.' },
  { title: 'Wind Speed: ', description: 'Moderate winds support clear skies.' },
  { title: 'UV Index: ', description: 'Higher solar activity increases chances.' },
  { title: 'Cloud Cover: ', description: 'Fewer clouds mean better visibility.' },
  { title: 'Time of Day: ', description: 'Auroras are visible only at night.' },
];

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  closeRow: {
    alignItems: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 8,
  },
  itemText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default AuroraPopup;