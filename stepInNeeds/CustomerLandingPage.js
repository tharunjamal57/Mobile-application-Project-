import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { query, where, collection, getDocs } from "firebase/firestore";
import * as Location from "expo-location";
import { db } from "./Firebase";
import Header from "./Header";

export default function GroceryBuyingPage({ navigation }) {
  const [showPopup, setShowPopup] = useState(false);
  const [dmart, setdmart] = useState([]);
  const [bigbazar, setbigbazar] = useState([]);
  const [myntra, setmyntra] = useState([]);
  const [myItem, setItem] = useState(null);
  const { user } = useAuth();
  const [deviceAddress, setDeviceAddress] = useState("");
  const [trendingItems, setTrendingItems] = useState([]);

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

    const existingIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
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
    }

    try {
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.log("Error storing cart in AsyncStorage:", e);
    }
  }

  function showPopupandItem(tmpItem) {
    setShowPopup(true);
    console.log(tmpItem);
    setItem(tmpItem);
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      const place = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(place);
      let city, country;
      place.find((p) => {
        (city = p.city),
          (country = p.country),
          (district = p.district),
          (isoCountryCode = p.isoCountryCode),
          (placeName = p.name);
      });

      setDeviceAddress(placeName + ", " + city + ", " + country);
      AsyncStorage.setItem("address", deviceAddress);
      // Store the place variable in AsyncStorage
      try {
        await AsyncStorage.setItem("place", JSON.stringify(place));
      } catch (e) {
        console.log("Error storing place in AsyncStorage:", e);
      }
    })();
  }, []);

  const handleCategoryPress = async (category) => {
    try {
      // Navigate to the categorical items screen
      navigation.navigate("CategoricalItems", { category });
    } catch (error) {
      console.log("Error saving selected category:", error);
    }
  };

  useEffect(() => {
    const fetchTrendingItems = async () => {
      const trendingItemsQuery = query(
        collection(db, "items"),
        where("customers_bought", ">", 10)
      );

      const dmartquery = query(
        collection(db, "items"),
        where("vendor_name", "==", "dmart")
      );
      const bigbazarquery = query(
        collection(db, "items"),
        where("vendor_name", "==", "bigbazaar")
      );
      const myntraquery = query(
        collection(db, "items"),
        where("vendor_name", "==", "myntra")
      );
      const trendingItemsSnapshot = await getDocs(trendingItemsQuery);
      const dmartSnapshot = await getDocs(dmartquery);
      const bigbazarSnapshot = await getDocs(bigbazarquery);
      const myntraSnapshot = await getDocs(myntraquery);

      const trendingItemsData = trendingItemsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      const dmartData = dmartSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      const bigbazarData = bigbazarSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      const myntraData = myntraSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      console.log(trendingItemsData);
      setTrendingItems(trendingItemsData);
      setdmart(dmartData);
      setbigbazar(bigbazarData);
      setmyntra(myntraData);
    };
    fetchTrendingItems();
  }, []);

  // add listener for back button press
  const backAction = () => {
    if (showPopup) {
      setShowPopup(false);
      setItem(null);
      return true; // prevent default action (going back)
    }
    if (user) {
      return true;
    }
    return false; // allow default action
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

      {/* Trending items */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.trendingContainer}>
          <Text style={styles.trendingTitle}>Trending items:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingItems.map((item) => (
              <View key={item.name} style={styles.trendingItem}>
                <TouchableOpacity onPress={() => showPopupandItem(item)}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.trendingItemImage}
                  />
                  <Text style={styles.trendingItemTitle}>{item.name}</Text>
                  <Text style={styles.trendingItemPrice}>${item.price}/lb</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Popup */}
        {showPopup && (
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              <Image source={{ uri: myItem.image }} style={styles.popupImage} />
              <Text style={styles.popupTitle}>{myItem.name}</Text>
              <Text style={styles.popupPrice}>{myItem.price}</Text>
              <View style={styles.popupButtons}>
                <TouchableOpacity style={styles.popupButton}>
                  <Text style={styles.popupButtonText}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.popupButton}
                  onPress={() => insertItemIntoCart(myItem)}
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

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categories:</Text>
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={styles.category}
              onPress={() => handleCategoryPress("fruitsandvegetables")}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryTitle}>Fruits & Vegetables</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.category}
              onPress={() => handleCategoryPress("meatandseafood")}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryTitle}>Meat & Seafood</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={styles.category}
              onPress={() => handleCategoryPress("bakeryandbread")}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryTitle}>Bakery & Bread</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.category}
              onPress={() => handleCategoryPress("dairyandeggs")}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryTitle}>Dairy & Eggs</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={styles.category}
              onPress={() => handleCategoryPress("clothesmen")}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryTitle}>Clothes Men</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.category}
              onPress={() => handleCategoryPress("clotheswomen")}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryTitle}>clotheswomen</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.trendingContainer}>
          <Text style={styles.trendingTitle}>Dmart:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dmart.map((item) => (
              <View key={item.name} style={styles.trendingItem}>
                <TouchableOpacity onPress={() => showPopupandItem(item)}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.trendingItemImage}
                  />
                  <Text style={styles.trendingItemTitle}>{item.name}</Text>
                  <Text style={styles.trendingItemPrice}>${item.price}/lb</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.trendingContainer}>
          <Text style={styles.trendingTitle}>Big Bazaar:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {bigbazar.map((item) => (
              <View key={item.name} style={styles.trendingItem}>
                <TouchableOpacity onPress={() => showPopupandItem(item)}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.trendingItemImage}
                  />
                  <Text style={styles.trendingItemTitle}>{item.name}</Text>
                  <Text style={styles.trendingItemPrice}>${item.price}/lb</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.trendingContainer}>
          <Text style={styles.trendingTitle}>Myntra:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {myntra.map((item) => (
              <View key={item.name} style={styles.trendingItem}>
                <TouchableOpacity onPress={() => showPopupandItem(item)}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.trendingItemImage}
                  />
                  <Text style={styles.trendingItemTitle}>{item.name}</Text>
                  <Text style={styles.trendingItemPrice}>${item.price}/lb</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#2ECC71",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cartIconContainer: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  cartIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "red",
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    minHeight: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "monospace",
    marginRight: 5,
  },
  locationText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "monospace",
  },
  searchContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "bold",
  },
  trendingContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  trendingTitle: {
    fontFamily: "monospace",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  trendingItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: 120,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  trendingItemImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  trendingItemTitle: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  trendingItemPrice: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  categoriesContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  categoriesTitle: {
    fontFamily: "monospace",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  category: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "48%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  categoryTitle: {
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
});
