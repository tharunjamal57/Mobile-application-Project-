import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  BackHandler,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import {
  query,
  where,
  collection,
  getDocs,
  addDoc,
  GeoPoint,
} from "firebase/firestore";
import { db } from "./Firebase";
import Header from "./Header";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";

export default function VendorLandingPage({ navigation }) {
  const [deviceAddress, setDeviceAddress] = useState("");
  const { user } = useAuth();
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [itemAddedMessage, setItemAddedMessage] = useState("");
  const categories = [
    { label: "Fruits and Vegetables", value: "fruitsandvegetables" },
    { label: "Meat and Seafood", value: "meatandseafood" },
    { label: "Bakery and Bread", value: "bakeryandbread" },
    { label: "Dairy and Eggs", value: "dairyandeggs" },
    { label: "Clothes for Men", value: "clothesmen" },
    { label: "Clothes for Women", value: "clotheswomen" },
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0].value);

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

  const backAction = () => {
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
  const handleItemUpload = async () => {
    console.log(
      itemName,
      itemPrice,
      itemDescription,
      selectedCategory,
      itemImage
    );
    if (
      !itemName ||
      !itemPrice ||
      !itemDescription ||
      !selectedCategory ||
      !itemImage
    ) {
      setItemAddedMessage("Please fill all the fields!");
      return;
    }

    let location = null;
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      } else {
        location = await Location.getCurrentPositionAsync({});
      }
    } catch (error) {
      console.log("Error getting current location:", error);
    }
    const newItem = {
      name: itemName,
      price: itemPrice,
      description: itemDescription,
      category: selectedCategory,
      image: itemImage,
      vendor_id: user.uid,
      vendor_name: user.email.split("@")[0], // add vendor name here
      customers_bought: 0,
      vendor_location: location
        ? new GeoPoint(location.coords.latitude, location.coords.longitude)
        : null,
    };

    try {
      const docRef = await addDoc(collection(db, "items"), newItem);
      console.log("Item added with ID:", docRef.id);
      setItemName("");
      setItemPrice("");
      setItemDescription("");
      setItemCategory("");
      setItemImage("");
      setItemAddedMessage("Item added successfully!");
    } catch (error) {
      console.log("Error adding item:", error);
      setItemAddedMessage("Error adding item, please try again!");
    }
  };

  const handleItemNameChange = (value) => {
    setItemName(value);
    setItemAddedMessage("");
  };

  const handleItemPriceChange = (value) => {
    setItemPrice(value);
    setItemAddedMessage("");
  };

  const handleViewItems = () => {
    navigation.navigate("VendorItems");
  };

  const handleItemDescriptionChange = (value) => {
    setItemDescription(value);
    setItemAddedMessage("");
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setItemAddedMessage("");
  };

  const handleItemImageChange = (value) => {
    setItemImage(value);
    setItemAddedMessage("");
  };

  const handleViewRequests = async () => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "customer_orders"),
          where("vendor_id", "==", user.uid)
        )
      );
      console.log("Number of order requests:", querySnapshot.size);
      navigation.navigate("OrderRequests", { orders: querySnapshot.docs });
    } catch (error) {
      console.log("Error fetching order requests:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          const querySnapshot = await getDocs(
            query(collection(db, "items"), where("vendor_id", "==", user.uid))
          );
          console.log("Number of items listed by vendor:", querySnapshot.size);
        } catch (error) {
          console.log("Error fetching items:", error);
        }
      })();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header title="Vendor Dashboard" deviceAddress={deviceAddress} />
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Item</Text>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={itemName}
            onChangeText={handleItemNameChange}
            leftIcon={<MaterialIcons name="title" size={20} color="black" />}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={itemPrice}
            onChangeText={handleItemPriceChange}
            leftIcon={
              <MaterialIcons name="attach-money" size={20} color="black" />
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={itemDescription}
            onChangeText={handleItemDescriptionChange}
            leftIcon={
              <MaterialIcons name="description" size={20} color="black" />
            }
          />
          <CustomPicker
            style={styles.input}
            selectedValue={selectedCategory}
            onValueChange={handleCategoryChange}
            items={categories}
            leftIcon={<MaterialIcons name="category" size={20} color="black" />}
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={itemImage}
            onChangeText={handleItemImageChange}
            leftIcon={<MaterialIcons name="image" size={20} color="black" />}
          />
          <TouchableOpacity style={styles.button} onPress={handleItemUpload}>
            <Text style={styles.buttonText}>Upload Item</Text>
          </TouchableOpacity>
          {itemAddedMessage ? (
            <Text style={styles.message}>{itemAddedMessage}</Text>
          ) : null}
        </View>
        <View style={styles.separator}></View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listed Items</Text>
          <TouchableOpacity style={styles.button} onPress={handleViewItems}>
            <Text style={styles.buttonText}>View Listed Items</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Requests</Text>
          <TouchableOpacity style={styles.button} onPress={handleViewRequests}>
            <Text style={styles.buttonText}>View Requests</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  section: {
    padding: 25,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2ECC71",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    color: "green",
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  header: {
    backgroundColor: "#007bff",
    padding: 15,
  },
  headerText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

// Update CustomPicker component
const CustomPicker = ({
  style,
  selectedValue,
  onValueChange,
  items,
  leftIcon,
}) => {
  return (
    <View
      style={[
        style,
        { flexDirection: "row", alignItems: "center", borderColor: "#dbdbdb" },
      ]}
    >
      {leftIcon}
      <Picker
        style={{ flex: 1 }}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};
