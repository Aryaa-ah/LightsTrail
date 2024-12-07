import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Replace with your Mapbox Access Token
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2lkNzMyIiwiYSI6ImNtNGNjMWcxajBhOG8yaXB6Nmxka2ZoazIifQ.-VDkqKwQTD476C9cm31S8w";

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

const MapWithAurora: React.FC<{
  data: AuroraData;
  longitude: number;
  latitude: number;
}> = ({ data, longitude, latitude }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [auroraData, setAuroraData] = useState<number[][] | null>(null);

  // Fetch aurora data
  useEffect(() => {
    const fetchAuroraData = async () => {
      try {
        const response = await fetch(
          "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json"
        );
        const auroraJson = await response.json();
        setAuroraData(auroraJson.coordinates);
      } catch (error) {
        console.error("Error fetching aurora data:", error);
      }
    };
    fetchAuroraData();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: data.isDay.toLowerCase() === "day"
        ? "mapbox://styles/mapbox/light-v11"
        : "mapbox://styles/mapbox/dark-v11",
      center: [longitude, latitude],
      zoom: 1.3,
      projection: "globe",
    });

    mapRef.current.on("style.load", () => {
      mapRef.current?.setFog({
        range: [-1, 2],
        color: "white",
        "high-color": "#add8e6",
        "horizon-blend": 0.05,
        "space-color": "#000000",
        "star-intensity": 0.2,
      });

      // Add aurora data to the map
      if (auroraData) {
        
        const filteredAuroraData = auroraData.filter(([lng, lat, value]) => value > 2);

        const geojson = {
          type: "FeatureCollection",
          features: filteredAuroraData.map(([lng, lat, value]) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            properties: {
              aurora: value,
            },
          })),
        };

        mapRef.current?.addSource("aurora-data", {
          type: "geojson",
          data: geojson,
        });

        mapRef.current?.addLayer({
          id: "aurora-points",
          type: "circle",
          source: "aurora-data",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "aurora"], 3, 3, 10, 8],
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "aurora"],
              3,
              "rgba(0, 255, 0, 0.2)", // Slightly more visible at lower values
              10,
              "rgba(0, 255, 0, 0.8)",
            ],
            "circle-opacity": 0.7,
          },
        });
      }

      // Add the marker and circle from additional data
      const marker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);

      marker.setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div  style="color: black;">
            <strong>KP Index:</strong> ${data.kpIndex}<br />
            <strong>Bz:</strong> ${data.bz}<br />
            <strong>Speed:</strong> ${data.speed} km/s<br />
            <strong>Temperature:</strong> ${data.temperature}<br />
            <strong>Precipitation:</strong> ${data.precipitation}<br />
            <strong>Wind Speed:</strong> ${data.windSpeed}<br />
            <strong>UV Index:</strong> ${data.uvIndex}<br />
            <strong>Cloud Cover:</strong> ${data.cloudCover}<br />
            <strong>Day/Night:</strong> ${data.isDay}<br />
            <strong>Probability:</strong> ${data.probability}<br />
          </div>
        `)
      );

      if (parseInt(data.probability) > 30) {
        const circleRadius = Math.min(parseInt(data.probability) * 0.5, 50);
        const circleColor = `rgba(0, 255, 0, ${parseInt(data.probability) / 100})`;

        mapRef.current?.addLayer({
          id: "custom-circle",
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
                  properties: {},
                },
              ],
            },
          },
          paint: {
            "circle-radius": circleRadius,
            "circle-color": circleColor,
            "circle-opacity": 0.6,
          },
        });
      }
    });

    return () => mapRef.current?.remove();
  }, [auroraData, data]);

  return <div ref={mapContainerRef} style={{ height: "80vh", width: "74%" , margin: "auto",
    padding: 20,
    marginTop:30, opacity:0.7}} />;
};

export default MapWithAurora;
