// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AuroraDashboard from '../../components/AuroraDashboard';
import AuroraMap from '../../components/AuroraMap';
import LocationPicker from '../../components/LocationPicker';

export default function HomeScreen() {
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [location, setLocation] = useState({
    latitude: 60,
    longitude: -100,
  });

  // Open location picker when screen mounts
  useEffect(() => {
    setLocationPickerVisible(true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
       
        <TouchableOpacity
          style={styles.changeLocationButton}
          onPress={() => setLocationPickerVisible(true)}
        >
          <Text style={styles.changeLocationText}>Change Location</Text>
        </TouchableOpacity>
      </View>

      <AuroraDashboard
        latitude={location.latitude}
        longitude={location.longitude}
      />

      <AuroraMap
        data={{
          kpIndex: '3',
          bz: '-5',
          speed: '500',
          temperature: '-20',
          precipitation: '0',
          windSpeed: '10',
          probability: '0.5',
          isDay: 'night',
          cloudCover: '20',
          uvIndex: '1',
        }}
        latitude={location.latitude}
        longitude={location.longitude}
      />

      <LocationPicker
        visible={locationPickerVisible}
        onClose={() => setLocationPickerVisible(false)}
        onLocationSelected={(newLocation) => {
          // ✅ Make sure newLocation is { latitude, longitude }
          setLocation({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          });
          setLocationPickerVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  changeLocationButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#333',
    borderRadius: 6,
  },
  changeLocationText: {
    color: '#fff',
    fontSize: 14,
  },
});