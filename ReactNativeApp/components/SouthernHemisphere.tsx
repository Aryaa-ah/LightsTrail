import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SouthernHemisphere() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch(
        'https://services.swpc.noaa.gov/products/animations/ovation_south_24h.json'
      );
      const data = await response.json();
      const urls = data.map((item: { url: string }) => `https://services.swpc.noaa.gov${item.url}`);
      setImages(urls);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 200);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, images]);

  if (images.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Southern Hemisphere animation...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Southern Hemisphere Aurora Forecast</Text>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: images[currentIndex] }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.progressBarWrapper}>
        <View style={[styles.progressBar, { width: `${(currentIndex / (images.length - 1)) * 100}%` }]} />
      </View>
      <TouchableOpacity
        style={[styles.button, isPlaying && styles.buttonActive]}
        onPress={() => setIsPlaying((prev) => !prev)}
      >
        <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  imageContainer: {
    width: '100%',
    height: width * 0.75,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  progressBarWrapper: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonActive: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 16,
  },
  loadingText: {
    color: '#ccc',
    fontSize: 14,
  },
});