import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";
import * as Location from "expo-location";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";

const CustomerRouteMap = ({ route, navigation }) => {
  const { orderId, itemId } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const GOOGLE_MAPS_APIKEY = "<YOUR_API_KEY>";

  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
    };

    const getCustomerLocation = async () => {
      try {
        const docRef = doc(db, `customer_orders/${orderId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { location } = docSnap.data();
          setCustomerLocation(location);
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.log("Error getting customer location:", e);
      }
    };

    getCurrentLocation();
    getCustomerLocation();
  }, []);

  const handleDelivered = async () => {
    try {
      await updateDoc(doc(db, "customer_orders", orderId), {
        is_delivered: true,
      });
      navigation.navigate("Delivered");
    } catch (e) {
      console.log("Error updating order status to delivered:", e);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {userLocation && customerLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={userLocation} title="Your Location" />
          <Marker coordinate={customerLocation} title="Customer Location" />
          <MapViewDirections
            origin={userLocation}
            destination={customerLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="blue"
          />
        </MapView>
      )}
      <TouchableOpacity style={styles.button} onPress={handleDelivered}>
        <Text style={styles.buttonText}>Delivered</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    backgroundColor: "#2ECC71",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
});

export default CustomerRouteMap;
