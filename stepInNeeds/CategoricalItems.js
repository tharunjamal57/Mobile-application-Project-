import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./Header";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./Firebase";

export default function CategoricalItems({ navigation, route }) {
  const [showPopup, setShowPopup] = useState(false);
  const [c_items, setItems] = useState([]);
  const [popupItem, setPopupItem] = useState(null);
  const [deviceAddress, setDeviceAddress] = useState("");
  function showPopupandItem(tmpItem) {
    setShowPopup(true);
    console.log(tmpItem);
    setPopupItem(tmpItem);
  }

  async function insertItemIntoCart(item) {
    let cart = [];
    try {
      const value = await AsyncStorage.getItem("cart");
      if (value !== null) {
        cart = JSON.parse(value);
      }
    } catch (e) {
      console.log("Error retrieving or parsing cart from AsyncStorage:", e);
    }

    console.log("cart");
    const existingIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
    console.log(cart[existingIndex]);
    if (existingIndex !== -1) {
      // Item already exists in cart, so increment its quantity
      cart[existingIndex].quantity += 1;
    } else {
      // Item does not exist in cart, so add it with a quantity of 1
      cart.push({
        id: item.id,
        image: item.image,
        name: item.name,
        price: item.price,
        quantity: 1,
        vendor_id: item.vendor_id,
        vendor_name: item.vendor_name,
        vendor_location: item.vendor_location,
      });
      console.log("cart " + JSON.stringify(cart));
    }
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      console.log(AsyncStorage.getItem("cart"));
    } catch (e) {
      console.log("Error storing cart in AsyncStorage:", e);
    }
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const address = await AsyncStorage.getItem("address");
        const category = route.params.category;
        setDeviceAddress(address);
        console.log(category);
        const itemsQuery = query(
          collection(db, "items"),
          where("category", "==", category)
        );
        const itemsSnapshot = await getDocs(itemsQuery);

        const filteredItems = itemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("filteredItems", JSON.stringify(filteredItems));

        setItems(filteredItems);
      } catch (e) {
        console.log("Error fetching items from Firestore:", e);
      }
    };
    fetchItems();
  }, [route.params.category]);

  // add listener for back button press
  const backAction = () => {
    if (showPopup) {
      setShowPopup(false);
      setPopupItem(null);
      return true; // prevent default action (going back)
    } // allow default action
    return false;
  };

  useFocusEffect(() => {
    // add back button listener when component is focused
    BackHandler.addEventListener("hardwareBackPress", backAction);

    // remove back button listener when component is unfocused
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  });
  return (
    <View style={styles.container}>
      <Header
        deviceAddress={deviceAddress}
        handlePressCart={() => navigation.navigate("Cart")}
      />
      <ScrollView contentContainerStyle={styles.itemContainer}>
        {c_items.map((item) => (
          <View key={item.id}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => showPopupandItem(item)}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {showPopup && (
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Image
              source={{ uri: popupItem.image }}
              style={styles.popupImage}
            />
            <Text style={styles.popupTitle}>{popupItem.name}</Text>
            <Text style={styles.popupPrice}>{popupItem.price}</Text>
            <View style={styles.popupButtons}>
              <TouchableOpacity style={styles.popupButton}>
                <Text style={styles.popupButtonText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popupButton}
                onPress={() => insertItemIntoCart(popupItem)}
              >
                <Text style={styles.popupButtonText}>Add to cart</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.popupBackground}
            onPress={() => setShowPopup(false)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  itemContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  popupContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  popupBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  popupImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  popupTitle: {
    fontFamily: "monospace",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  popupPrice: {
    fontFamily: "monospace",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  popupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  popupButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 8,
    padding: 10,
    width: "48%",
  },
  popupButtonText: {
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    fontFamily: "monospace",
  },
});
