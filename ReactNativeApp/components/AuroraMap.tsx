import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export interface AuroraData {
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

interface MapWithAuroraProps {
  data: AuroraData;
  longitude: number;
  latitude: number;
}

const MapWithAurora: React.FC<MapWithAuroraProps> = ({ data, longitude, latitude }) => {
  // Create the HTML content with your existing Mapbox GL JS code
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <script src='https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js'></script>
      <link href='https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css' rel='stylesheet' />
      <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #00ff00;
          font-family: Arial, sans-serif;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div id="loading" class="loading">Loading aurora data...</div>
      
      <script>
        mapboxgl.accessToken = 'pk.eyJ1Ijoic2lkNzMyIiwiYSI6ImNtNGNjMWcxajBhOG8yaXB6Nmxka2ZoazIifQ.-VDkqKwQTD476C9cm31S8w';
        
        const map = new mapboxgl.Map({
          container: 'map',
          style: '${data.isDay.toLowerCase() === 'day' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11'}',
          center: [${longitude}, ${latitude}],
          zoom: 1.3,
          projection: 'globe'
        });

        map.on('style.load', () => {
          map.setFog({
            range: [-1, 2],
            color: 'white',
            'high-color': '#add8e6',
            'horizon-blend': 0.05,
            'space-color': '#000000',
            'star-intensity': 0.2
          });

          // Fetch aurora data
          fetch('https://services.swpc.noaa.gov/json/ovation_aurora_latest.json')
            .then(response => response.json())
            .then(auroraJson => {
              document.getElementById('loading').style.display = 'none';
              
              const auroraData = auroraJson.coordinates;
              const filteredAuroraData = auroraData.filter(([lng, lat, value]) => value > 2);

              const geojson = {
                type: 'FeatureCollection',
                features: filteredAuroraData.map(([lng, lat, value]) => ({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                  },
                  properties: {
                    aurora: value
                  }
                }))
              };

              map.addSource('aurora-data', {
                type: 'geojson',
                data: geojson
              });

              map.addLayer({
                id: 'aurora-points',
                type: 'circle',
                source: 'aurora-data',
                paint: {
                  'circle-radius': ['interpolate', ['linear'], ['get', 'aurora'], 3, 3, 10, 8],
                  'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'aurora'],
                    3, 'rgba(0, 255, 0, 0.2)',
                    10, 'rgba(0, 255, 0, 0.8)'
                  ],
                  'circle-opacity': 0.7
                }
              });
            })
            .catch(error => {
              console.error('Error fetching aurora data:', error);
              document.getElementById('loading').innerHTML = 'Error loading aurora data';
            });

          // Add marker
          const marker = new mapboxgl.Marker()
            .setLngLat([${longitude}, ${latitude}])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(\`
                <div style="color: black; padding: 10px;">
                  <strong>KP Index:</strong> ${data.kpIndex}<br />
                  <strong>Bz:</strong> ${data.bz}<br />
                  <strong>Speed:</strong> ${data.speed} km/s<br />
                  <strong>Temperature:</strong> ${data.temperature}<br />
                  <strong>Precipitation:</strong> ${data.precipitation}<br />
                  <strong>Wind Speed:</strong> ${data.windSpeed}<br />
                  <strong>UV Index:</strong> ${data.uvIndex}<br />
                  <strong>Cloud Cover:</strong> ${data.cloudCover}<br />
                  <strong>Day/Night:</strong> ${data.isDay}<br />
                  <strong>Probability:</strong> ${data.probability}%<br />
                </div>
              \`)
            )
            .addTo(map);

          // Add probability circle if > 30%
          if (${parseInt(data.probability)} > 30) {
            const circleGeoJSON = {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [${longitude}, ${latitude}]
                },
                properties: {}
              }]
            };

            map.addSource('probability-circle', {
              type: 'geojson',
              data: circleGeoJSON
            });

            map.addLayer({
              id: 'custom-circle',
              type: 'circle',
              source: 'probability-circle',
              paint: {
                'circle-radius': ${Math.min(parseInt(data.probability) * 0.5, 50)},
                'circle-color': 'rgba(0, 255, 0, ${parseInt(data.probability) / 100})',
                'circle-opacity': 0.6
              }
            });
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400, // Fixed height instead of percentage
    width: '100%', // Full width
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default MapWithAurora;