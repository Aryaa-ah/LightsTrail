import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Replace with your Mapbox Access Token
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2lkNzMyIiwiYSI6ImNtNGNjMWcxajBhOG8yaXB6Nmxka2ZoazIifQ.-VDkqKwQTD476C9cm31S8w";

// interface MapProps {
//   data: {
//     latitude: number;
//     longitude: number;
//     kpIndex: string;
//     bz: string;
//     speed: string;
//     temperature: string;
//     precipitation: string;
//     windSpeed: string;
//     uvIndex: string;
//     cloudCover: string;
//     isDay: string;
//     probability: number;
//   };
// }
export interface AuroraData {
  kpIndex: string;
  bz: string;
  speed: string;
  temperature: string;
  precipitation: string;
  windSpeed: string;
  probability: string;
  isDay: string;
  cloudCover: string
  uvIndex: string;
}

const MapboxMap: React.FC<{
  data: AuroraData;
  longitude: number;
  latitude: number;
}> = ({ data, longitude, latitude }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Determine map style based on isDay
    const mapStyle =
      data.isDay.toLowerCase() === "day"
        ? "mapbox://styles/mapbox/light-v11"
        : "mapbox://styles/mapbox/dark-v11";

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: mapStyle,
      center: [longitude, latitude],
      zoom: 10,
    });

    // Add Marker
    const marker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    // Add Popup to Marker
    marker.setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="color: black;">
          <strong>KP Index:</strong> ${data.kpIndex} <br />
          <strong>Bz:</strong> ${data.bz} <br />
          <strong>Speed:</strong> ${data.speed} km/s <br />
          <strong>Temperature:</strong> ${data.temperature} <br />
          <strong>Precipitation:</strong> ${data.precipitation} <br />
          <strong>Wind Speed:</strong> ${data.windSpeed} <br />
          <strong>UV Index:</strong> ${data.uvIndex} <br />
          <strong>Cloud Cover:</strong> ${data.cloudCover} <br />
          <strong>Day/Night:</strong> ${data.isDay} <br />
          <strong>Probability:</strong> ${data.probability} <br />
        </div>
      `)
    );

    // Add Aurora Circle based on Probability
    if ( parseInt(data.probability) > 30) {
      const circleRadius = Math.min( parseInt(data.probability) * 0.5, 50); // Maximum radius of 50 for high probabilities
      const circleColor = `rgba(0, 255, 0, ${ parseInt(data.probability) / 100})`; // Green color with opacity based on probability

      mapRef.current.on("load", () => {
        mapRef.current?.addLayer({
          id: "aurora-circle",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                  },
                  properties: {
                    description: "Aurora Effect",
                  },
                },
              ],
            },
          },
          paint: {
            "circle-radius": circleRadius,
            "circle-color": circleColor,
            "circle-opacity": 0.6, // Slight opacity for the glow effect
          },
        });
      });
    }

    return () => mapRef.current?.remove();
  }, [data]);

  return <div ref={mapContainerRef} style={{ height: "80vh", width: "74%",
    margin: "auto",
    padding: 20,
    marginTop:30,
   
    color: "white",
    opacity:data.isDay=="Day"?1:0.7, }} />;
};

export default MapboxMap;
