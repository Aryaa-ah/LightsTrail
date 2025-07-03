import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from "react-native";

interface WebCam {
  name: string;
  country: string;
  location: string;
  youtubeLink: string;
}

const webcams: WebCam[] = [
  {
    name: "Lyngen North Aurora Cam",
    country: "Norway",
    location: "Rotsund",
    youtubeLink: "https://www.youtube.com/live/SY6DOBZ2hPk?si=0Pfi1txt2DtKKdcW",
  },
  {
    name: "Aurora Borealis (LIVE!)",
    country: "Finland",
    location: "Utsjoki",
    youtubeLink: "https://www.youtube.com/live/dvNb31_0D68?si=-ziY3Mz1baUKT6Ia",
  },
  {
    name: "Fairbanks Aurora Camera",
    country: "United States",
    location: "Fairbanks, AK",
    youtubeLink: "https://www.youtube.com/live/O52zDyxg5QI?si=dntH2-y29Bwq8yP_",
  },
  {
    name: "Northern Studies Center",
    country: "Canada",
    location: "Churchill, MB",
    youtubeLink: "https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA",
  },
  {
    name: "Queenstown Roundshot",
    country: "New Zealand",
    location: "Queenstown",
    youtubeLink: "https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA",
  },
  {
    name: "Kjell Henriksen Observatory",
    country: "Norway",
    location: "Longyearbyen, Svalbard",
    youtubeLink: "https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA",
  },
];

export default function WebCamScreen() {
  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aurora Webcams</Text>
      <FlatList
        data={webcams}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item.youtubeLink)}
            activeOpacity={0.8}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>Country: {item.country}</Text>
            <Text style={styles.detail}>Location: {item.location}</Text>
            <Text style={styles.link}>Tap to open live stream</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#76c7c0",
    textAlign: "center",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#1e1e2f",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  link: {
    fontSize: 12,
    color: "#76c7c0",
    marginTop: 8,
    fontStyle: "italic",
  },
});