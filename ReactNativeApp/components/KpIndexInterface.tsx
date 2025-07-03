import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const TABS = [
  { id: '3Day', label: '3 Day', src: 'https://services.swpc.noaa.gov/images/swx-overview-large.gif' },
  { id: '7Day', label: '7 Day', src: 'https://services.swpc.noaa.gov/images/station-k-index.png' },
];

export default function KpIndexInterface() {
  const [activeTab, setActiveTab] = useState('3Day');
  const active = TABS.find(tab => tab.id === activeTab);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Kp Index (Live)</Text>
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {active && (
        <View style={styles.webviewContainer}>
          <WebView
            source={{ uri: active.src }}
            style={styles.webview}
            startInLoadingState
            scalesPageToFit
          />
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    backgroundColor: '#333',
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: '#007AFF',
  },
  tabLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  webviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 3,
    height: width * 0.75,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});