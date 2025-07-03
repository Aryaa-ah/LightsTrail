import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import SolarWindInterface from '../../components/SolarWindInterface';
import KpIndexInterface from '../../components/KpIndexInterface';
import NorthernHemisphere from '../../components/NorthernHemisphere';
import SouthernHemisphere from '../../components/SouthernHemisphere';

export default function LiveDataScreen() {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <SolarWindInterface />
      <KpIndexInterface />
       <NorthernHemisphere />
      <SouthernHemisphere />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000', // consistent background
  },
  container: {
    paddingBottom: 24,
    flexGrow: 1, // enables scrolling when content is shorter than screen height
  },
});