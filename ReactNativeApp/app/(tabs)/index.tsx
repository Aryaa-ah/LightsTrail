import React from 'react';
import { View, StyleSheet } from 'react-native';
import AuroraDashboard from '../../components/AuroraDashboard';
import Navbar from '../../components/Navbar';
import AuroraMap from '../../components/AuroraMap';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AuroraDashboard />
      </View>
      <AuroraMap
          data={{
            kpIndex: "3",
            bz: "-5",
            speed: "500",
            temperature: "-20",
            precipitation: "0",
            windSpeed: "10",
            probability: "0.5",
            isDay: "night",
            cloudCover: "20",
            uvIndex: "1"
          }}
          latitude={60}
          longitude={-100}
        />
      {/* <Navbar /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // or any color you want
  },
  content: {
    flex: 1,
  },
});