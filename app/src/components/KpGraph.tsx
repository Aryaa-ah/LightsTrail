import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from 'axios';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

// Registering the necessary chart components
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

interface KIndexData {
  time_tag: string;
  Kp: number;
  a_running: number;
  station_count: number;
}

const Graph: React.FC = () => {
  const {t} = useTranslation();
  const [data, setData] = useState<KIndexData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        
        // Skip the first row (header) and map the data
        const formattedData = response.data.slice(1).map((item: string[]) => ({
          time_tag: item[0],
          Kp: parseFloat(item[1]),
          a_running: parseFloat(item[2]),
          station_count: parseFloat(item[3]),
        }));

        setData(formattedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch Kp index data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.time_tag),
    datasets: [
      {
        label: "Kp Index",
        data: data.map(item => item.Kp),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Chart options for better readability
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'NOAA Planetary K-index',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Kp Index',
        },
      },
    },
  };

  // Render loading or error states
  if (isLoading) {
    return (
      <Container>
        <Typography variant="h6">Loading Kp Index data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {t("tourBooking.planetaryKIndexGraph")}
      </Typography>
      <Line data={chartData} options={chartOptions} />
    </Container>
  );
};

export default Graph;