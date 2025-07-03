import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAuroraData } from '../store/AuroraDashboardSlice';
import AuroraPopup from './AuroraInfoPopup';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AuroraDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auroraData = useSelector((state: RootState) => state.auroraDashboard.data);
  const loading = useSelector((state: RootState) => state.auroraDashboard.loading);
  const error = useSelector((state: RootState) => state.auroraDashboard.error);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    dispatch(fetchAuroraData());
  }, [dispatch]);

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const handleClose = () => {
    setShowInfo(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Aurora Dashboard</Text>
          <TouchableOpacity onPress={handleInfoClick}>
            <Icon name="info" size={20} color="#007bff" style={styles.infoIcon} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : error ? (
          <Text style={styles.error}>Failed to load data.</Text>
        ) : (
          <>
            <Text style={styles.item}>KP Index: {auroraData.kpIndex}</Text>
            <Text style={styles.item}>Temperature: {auroraData.temperature} °C</Text>
            <Text style={styles.item}>Humidity: {auroraData.humidity} %</Text>
            <Text style={styles.item}>Pressure: {auroraData.pressure} hPa</Text>
          </>
        )}
      </View>

      <AuroraPopup open={showInfo} onClose={handleClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  infoIcon: {
    marginLeft: 8,
  },
  item: {
    fontSize: 16,
    marginVertical: 4,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default AuroraDashboard;