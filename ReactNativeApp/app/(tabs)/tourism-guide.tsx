import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Linking
} from "react-native";

interface Destination {
  name: string;
  probability: number;
  bestMonths: string;
  avgTemp: number;
  description: string;
}

const destinations: Destination[] = [
  {
    name: "Iceland",
    probability: 80,
    bestMonths: "Sep-Mar",
    avgTemp: -2,
    description: "Land of fire and ice, perfect for aurora hunting",
  },
  {
    name: "Norway",
    probability: 75,
    bestMonths: "Oct-Mar",
    avgTemp: -4,
    description: "Arctic Circle magic with stunning fjord landscapes",
  },
  {
    name: "Finland",
    probability: 70,
    bestMonths: "Aug-Apr",
    avgTemp: -5,
    description: "Lapland's winter wonderland with glass igloos",
  },
];

export default function TourismGuideScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [booking, setBooking] = useState({
    name: "",
    email: "",
    destination: "",
    date: "",
  });

  const handleBook = (destination: string) => {
    setBooking({ ...booking, destination });
    setModalVisible(true);
  };

  const handleSubmit = () => {
    Alert.alert(
      "Booking Submitted",
      `Thank you, ${booking.name}! Your trip to ${booking.destination} has been booked.`,
    );
    setModalVisible(false);
    setBooking({ name: "", email: "", destination: "", date: "" });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Aurora Tourism Guide</Text>
      <Text style={styles.subtitle}>
        Explore top destinations to chase the Northern Lights.
      </Text>

      {destinations.map((dest) => (
        <View key={dest.name} style={styles.card}>
          <Text style={styles.cardTitle}>{dest.name}</Text>
          <Text style={styles.description}>{dest.description}</Text>
          <Text style={styles.detail}>🌟 Probability: {dest.probability}%</Text>
          <Text style={styles.detail}>📅 Best Months: {dest.bestMonths}</Text>
          <Text style={styles.detail}>🌡️ Avg Temp: {dest.avgTemp}°C</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleBook(dest.name)}
          >
            <Text style={styles.buttonText}>Book Trip</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.tips}>
        <Text style={styles.tipsHeader}>Quick Aurora Chasing Tips</Text>
        <Text style={styles.tip}>📸 Use manual camera settings</Text>
        <Text style={styles.tip}>🌞 Check solar activity forecasts</Text>
        <Text style={styles.tip}>📍 Choose dark sky locations</Text>
      </View>

      {/* Booking Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Book Your Adventure</Text>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#999"
              style={styles.input}
              value={booking.name}
              onChangeText={(text) => setBooking({ ...booking, name: text })}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="email-address"
              value={booking.email}
              onChangeText={(text) => setBooking({ ...booking, email: text })}
            />
            <TextInput
              placeholder="Preferred Travel Date (YYYY-MM-DD)"
              placeholderTextColor="#999"
              style={styles.input}
              value={booking.date}
              onChangeText={(text) => setBooking({ ...booking, date: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#76c7c0",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1e1e2f",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: "#ccc",
    marginBottom: 8,
  },
  detail: {
    color: "#aaa",
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingVertical: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  tips: {
    backgroundColor: "#1e1e2f",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  tipsHeader: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tip: {
    color: "#ccc",
    marginBottom: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1e1e2f",
    borderRadius: 8,
    padding: 16,
    width: "90%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2e2e2e",
    color: "#fff",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cancel: {
    color: "#ccc",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
  },
});