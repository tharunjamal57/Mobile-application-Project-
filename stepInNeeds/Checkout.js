import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Cart from "./Cart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "./Firebase";
import {
  serverTimestamp,
  addDoc,
  collection,
  doc,
  runTransaction,
} from "firebase/firestore";
import * as Location from "expo-location";
import { GeoPoint } from "firebase/firestore";

export default function Checkout({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("user");
        const userData = jsonValue != null ? JSON.parse(jsonValue) : {};
        const name = userData.email ? userData.email.split("@")[0] : "";
        setName(name);

        setEmail(userData.email);
      } catch (e) {
        console.log("Error fetching user data from AsyncStorage:", e);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        let location = await Location.getCurrentPositionAsync({});
        console.log(location);
        const place = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log(place);
        let city, country, district, isoCountryCode, placeName;
        place.find((p) => {
          (city = p.city),
            (country = p.country),
            (district = p.district),
            (isoCountryCode = p.isoCountryCode),
            (placeName = p.name);
        });
        setAddress(`${placeName}, ${district}, ${city}, ${country}`);
        setLocation(
          new GeoPoint(location.coords.latitude, location.coords.longitude)
        );
      } catch (e) {
        console.log("Error fetching address from Location:", e);
      }
    };
    fetchAddress();
  }, []);

  const handleCheckout = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      const user = jsonValue != null ? JSON.parse(jsonValue) : {};
      const cartItemsJson = await AsyncStorage.getItem("cart");
      const cartItems = JSON.parse(cartItemsJson);
      const timestamp = serverTimestamp();
      const total_amount = await AsyncStorage.getItem("cartTotal");

      // Create a new order document with the user's order details and location
      const orderDoc = await addDoc(collection(db, "customer_orders"), {
        total_amount: total_amount,
        customer_id: user.uid,
        date_ordered: timestamp,
        is_order_placed: true,
        is_packaged: false,
        is_one_the_way: false,
        is_delivered: false,
        customer_name: name,
        location: location, // store the location as a GeoPoint
      });
      // Add each item from the cart to the new order document
      console.log("cart", cartItems);
      for (const item of cartItems) {
        const { id, name, price, quantity, vendor_id, vendor_name, image } =
          item;
        console.log(
          id,
          name,
          price,
          quantity,
          vendor_id,
          vendor_name,
          orderDoc.id
        );

        // Check that id is defined before adding to the collection
        if (id) {
          // Add the item to the customer_orders/{orderId}/items collection
          const vendor_location = item.vendor_location
            ? new GeoPoint(
                item.vendor_location.latitude,
                item.vendor_location.longitude
              )
            : null;
          console.log(vendor_location);
          await addDoc(collection(db, `customer_orders/${orderDoc.id}/items`), {
            item_id: id,
            item_name: name,
            price: price,
            quantity: quantity,
            vendor_id: vendor_id,
            vendor_name: vendor_name,
            image: image,
            is_packaged: false,
            is_order_placed: true,
            is_one_the_way: false,
            is_delivered: false,
            vendor_location: vendor_location, // store the location as a GeoPoint
          });

          // Increment the customers_bought field for the item in the items collection
          const itemRef = doc(db, "items", id);

          await runTransaction(db, async (transaction) => {
            const itemDoc = await transaction.get(itemRef);
            const currentCustomersBought = itemDoc.data().customers_bought || 0;
            transaction.update(itemRef, {
              customers_bought: currentCustomersBought + quantity,
            });
          });
        }
      }
      // Clear the cart and navigate to the confirmation page
      await AsyncStorage.removeItem("cart");
      await AsyncStorage.setItem("orderId", orderDoc.id);
      navigation.navigate("OrderStatus");
    } catch (e) {
      console.log("Error placing order:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Cart />
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Billing Information</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{name}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{email}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{address}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  formContainer: {
    padding: 20,
  },
  formLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "monospace",
  },
  textContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "monospace",
  },
  checkoutButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
});
