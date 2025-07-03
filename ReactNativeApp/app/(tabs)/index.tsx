// Alternative version with sticky header
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuroraDashboard from '../../components/AuroraDashboard';
import AuroraMap from '../../components/AuroraMap';
import LocationPicker from '../../components/LocationPicker';

const { height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [location, setLocation] = useState({
    latitude: 60,
    longitude: -100,
  });

  useEffect(() => {
    setLocationPickerVisible(true);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aurora Tracker</Text>
        <TouchableOpacity
          style={styles.changeLocationButton}
          onPress={() => setLocationPickerVisible(true)}
        >
          <Text style={styles.changeLocationText}>Change Location</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <AuroraDashboard
          latitude={location.latitude}
          longitude={location.longitude}
        />

        <View style={styles.mapContainer}>
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
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <LocationPicker
        visible={locationPickerVisible}
        onClose={() => setLocationPickerVisible(false)}
        onLocationSelected={(newLocation) => {
          setLocation({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          });
          setLocationPickerVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  mapContainer: {
    height: screenHeight * 0.5,
    marginVertical: 16,
  },
  bottomSpacer: {
    height: 50,
  },
});