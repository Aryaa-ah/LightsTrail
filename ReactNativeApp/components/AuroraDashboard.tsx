import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState, AppDispatch } from '../store';
import { fetchAuroraData } from '../store/AuroraDashboardSlice';
import AuroraPopup from './AuroraInfoPopup';

interface AuroraDashboardProps {
  latitude: number;
  longitude: number;
}

export default function AuroraDashboard({ latitude, longitude }: AuroraDashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.auroraDashboard);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    dispatch(fetchAuroraData({ latitude, longitude }));
  }, [dispatch, latitude, longitude]);

  const handleInfoClick = () => setShowInfo(true);
  const handleClose = () => setShowInfo(false);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error loading data: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Aurora Dashboard</Text>
          <TouchableOpacity onPress={handleInfoClick}>
            <Icon name="info" size={20} color="#00BFFF" />
          </TouchableOpacity>
        </View>

        {/* Data Grid */}
        <View style={styles.grid}>
          <View style={styles.item}>
            <Text style={styles.label}>KP Index</Text>
            <Text style={styles.value}>{data.kpIndex}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Magnetic Field (Bz)</Text>
            <Text style={styles.value}>{data.bz}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Solar Wind Speed</Text>
            <Text style={styles.value}>{data.speed} km/s</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Temperature</Text>
            <Text style={styles.value}>{data.temperature}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Precipitation</Text>
            <Text style={styles.value}>{data.precipitation}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Wind Speed</Text>
            <Text style={styles.value}>{data.windSpeed}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>UV Index</Text>
            <Text style={styles.value}>{data.uvIndex}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.label}>Probability</Text>
            <View style={styles.probRow}>
              <Icon
                name={
                  parseInt(data.probability) > 70
                    ? 'whatshot'
                    : parseInt(data.probability) > 50
                    ? 'trending-up'
                    : 'trending-down'
                }
                size={18}
                color={
                  parseInt(data.probability) > 90
                    ? '#FF0000'
                    : parseInt(data.probability) > 70
                    ? '#FFA500'
                    : parseInt(data.probability) > 50
                    ? '#00FF00'
                    : '#999'
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      parseInt(data.probability) > 90
                        ? '#FF0000'
                        : parseInt(data.probability) > 70
                        ? '#FFA500'
                        : parseInt(data.probability) > 50
                        ? '#00FF00'
                        : '#999',
                  },
                ]}
              >
                {data.probability}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      <AuroraPopup open={showInfo} onClose={handleClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    marginBottom: 12,
  },
  itemRow: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  probRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});