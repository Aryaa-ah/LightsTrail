import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map, GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2lkNzMyIiwiYSI6ImNtNGNjMWcxajBhOG8yaXB6Nmxka2ZoazIifQ.-VDkqKwQTD476C9cm31S8w';

const AuroraGlobe: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [auroraData, setAuroraData] = useState<[number, number, number][] | null>(null);

  // Fetch aurora data
  useEffect(() => {
    const fetchAuroraData = async () => {
      try {
        const response = await fetch(
          'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json'
        );
        const data = await response.json();
        setAuroraData(data.coordinates);
      } catch (error) {
        console.error('Error fetching aurora data:', error);
      }
    };

    fetchAuroraData();
  }, []);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9', // Satellite view for a better 3D experience
      center: [0, 0],
      zoom: 1.5,
      projection: 'globe', // Enable 3D globe
    });

    map.current.on('style.load', () => {
      // Add atmospheric effect
      map.current?.setFog({
        range: [-1, 2],
        color: 'white',
        "high-color": "#add8e6",
        "horizon-blend": 0.05,
        "space-color": "#000000",
        "star-intensity": 0.2,
      });
    });
  }, []);

  // Add data to globe
  useEffect(() => {
    if (!auroraData || !map.current) return;

    const geojson = {
      type: 'FeatureCollection',
      features: auroraData.map(([lng, lat, aurora]) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          aurora,
        },
      })),
    };

    map.current.on('load', () => {
      if (map.current?.getSource('aurora')) {
        (map.current.getSource('aurora') as GeoJSONSource).setData(geojson);
      } else {
        map.current?.addSource('aurora', { type: 'geojson', data: geojson });
      }

      if (!map.current?.getLayer('aurora-circles')) {
        map.current?.addLayer({
          id: 'aurora-circles',
          type: 'circle',
          source: 'aurora',
          paint: {
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'aurora'],
              0,
              'rgba(0, 255, 0, 0)', // Transparent for low aurora values
              10,
              'rgba(0, 255, 0, 0.8)', // Bright green for high aurora values
            ],
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'aurora'],
              0,
              0, // No circle for aurora value 0
              10,
              15, // Larger radius for high aurora values
            ],
            'circle-opacity': 0.8,
          },
        });
      }
    });
  }, [auroraData]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default AuroraGlobe;
