import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Delivered = ({ navigation }) => {
  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "CarrierLandingPage" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Delivered!</Text>
      <Text style={styles.subheader}>Thank you for your order.</Text>
      <TouchableOpacity onPress={goToHome} style={styles.button}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#2ECC71",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Delivered;
