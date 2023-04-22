import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "./AuthContext";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./Firebase";

export default function VendorItems({ navigation }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "items"), where("vendor_id", "==", user.uid))
      );
      const itemList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemList);
    } catch (error) {
      console.log("Error fetching items:", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <Image style={styles.itemImage} source={{ uri: item.image }} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  itemInfo: {
    flex: 1,
    padding: 15,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 18,
    color: "#2ECC71",
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 14,
    color: "#333333",
    fontStyle: "italic",
    marginTop: 5,
  },
  itemCategory: {
    fontSize: 14,
    color: "#999999",
    marginTop: 5,
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemDetailText: {
    marginLeft: 5,
  },
});
