import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const TABS = [
  { id: '2Hour', label: '2H', src: 'https://services.swpc.noaa.gov/images/ace-mag-swepam-2-hour.gif' },
  { id: '6Hour', label: '6H', src: 'https://services.swpc.noaa.gov/images/ace-mag-swepam-6-hour.gif' },
  { id: '24Hour', label: '24H', src: 'https://services.swpc.noaa.gov/images/ace-mag-swepam-24-hour.gif' },
  { id: '3Day', label: '3D', src: 'https://services.swpc.noaa.gov/images/ace-mag-swepam-3-day.gif' },
  { id: '7Day', label: '7D', src: 'https://services.swpc.noaa.gov/images/ace-mag-swepam-7-day.gif' },
];

export default function SolarWindInterface() {
  const [activeTab, setActiveTab] = useState('7Day');
  const active = TABS.find((tab) => tab.id === activeTab);

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.heading}>Solar Wind Data</Text>

          <View style={styles.tabRow}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
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
        </View>

        <View style={styles.imageContainer}>
          {active && (
            <WebView
              source={{ uri: active.src }}
              style={styles.webview}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#444',
  },
  tabLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: width * 0.75, // Adjusted height ratio
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});