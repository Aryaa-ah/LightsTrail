import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';

interface Props {
  visible: boolean;
  onClose: () => void;
  onLocationSelected: (location: { latitude: number; longitude: number }) => void;
}

export default function LocationPicker({ visible, onClose, onLocationSelected }: Props) {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleUseCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setSelectedLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelected({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select Location</Text>

          <TouchableOpacity style={styles.useButton} onPress={handleUseCurrentLocation}>
            <Text style={styles.useButtonText}>Use Current Location</Text>
          </TouchableOpacity>

          <MapView
            style={styles.map}
            onPress={handleMapPress}
            initialRegion={{
              latitude: 60,
              longitude: -100,
              latitudeDelta: 30,
              longitudeDelta: 30,
            }}
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: selectedLocation ? '#007bff' : '#aaa' },
              ]}
              onPress={handleConfirm}
              disabled={!selectedLocation}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    width: '90%',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  useButton: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 10,
    marginBottom: 12,
  },
  useButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancel: {
    color: '#ccc',
    fontSize: 16,
  },
  confirmButton: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
});