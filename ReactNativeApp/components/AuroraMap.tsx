import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface AuroraData {
  kpIndex: string;
  bz: string;
  speed: string;
  temperature: string;
  precipitation: string;
  windSpeed: string;
  probability: string;
  isDay: string;
  cloudCover: string;
  uvIndex: string;
}

interface Props {
  data: AuroraData;
  latitude: number;
  longitude: number;
}

export default function AuroraMap({ data, latitude, longitude }: Props) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 30,
          longitudeDelta: 30,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Aurora Location"
          description={`KP Index: ${data.kpIndex}`}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});