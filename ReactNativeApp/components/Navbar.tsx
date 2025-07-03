import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Navbar() {
  const router = useRouter();

  const tabs = [
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'Gallery', icon: 'photo-library', path: '/gallery' },
    { label: 'Glossary', icon: 'menu-book', path: '/glossary' },
    { label: 'Live Data', icon: 'bar-chart', path: '/live-data' },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.navRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.label}
            style={styles.tab}
            onPress={() => router.push(tab.path)}
          >
            <Icon name={tab.icon} size={20} color="#fff" />
            <Text style={styles.tabLabel}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#1e1e1e',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#444',
  },
  tab: {
    alignItems: 'center',
  },
  tabLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});