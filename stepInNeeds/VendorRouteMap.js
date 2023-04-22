import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { db } from "./Firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";

const VendorRouteMap = ({ route, navigation }) => {
  const { latitude, longitude, orderId, itemId } = route.params;
  const [userLocation, setUserLocation] = useState(null);

  const GOOGLE_MAPS_APIKEY = "AIzaSyCmMe0hyfX813CrbFd9Hxra6qhcvs-LVok";

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

    getCurrentLocation();
  }, []);

  const handleItemReceived = async () => {
    try {
      await updateDoc(doc(db, `customer_orders/${orderId}/items`, itemId), {
        is_on_the_way: true,
      });

      // Navigate to the CustomerRouteMap screen
      navigation.navigate("CustomerRouteMap", {
        orderId,
        itemId,
      });
    } catch (e) {
      console.log(
        "Error updating item status to received and fetching customer location:",
        e
      );
    }
  };

  const vendorLocation = {
    latitude: latitude,
    longitude: longitude,
  };

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={userLocation} title="Your Location" />
          <Marker coordinate={vendorLocation} title="Vendor Location" />
          <MapViewDirections
            origin={userLocation}
            destination={vendorLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="blue"
          />
        </MapView>
      )}

      <TouchableOpacity style={styles.button} onPress={handleItemReceived}>
        <Text style={styles.buttonText}>Item Received</Text>
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

export default VendorRouteMap;
