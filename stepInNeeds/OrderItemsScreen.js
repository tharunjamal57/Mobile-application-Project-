import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { db } from "./Firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

const OrderItemsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const itemsSnapshot = await getDocs(
        collection(db, `customer_orders/${orderId}/items`)
      );
      const items = itemsSnapshot.docs.map((itemDoc) => ({
        id: itemDoc.id,
        ...itemDoc.data(),
      }));
      setItems(items);
    };

    fetchItems();
  }, [orderId]);

  const handleItemReceived = async (
    itemId,
    latitude,
    longitude,
    vendorLocation
  ) => {
    try {
      await updateDoc(doc(db, `customer_orders/${orderId}/items`, itemId), {
        is_on_the_way: true,
      });
    } catch (e) {
      console.log("Error updating item status to received:", e);
    }
  };

  const handleRouteToVendor = (iid, latitude, longitude) => {
    navigation.navigate("VendorRouteMap", {
      latitude: latitude,
      longitude: longitude,
      orderId: orderId,
      itemId: iid,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text style={styles.itemInfo}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemInfo}>Price: {item.price}</Text>

      <TouchableOpacity
        style={styles.routeButton}
        onPress={() =>
          handleRouteToVendor(
            item.id,
            item.vendor_location.latitude,
            item.vendor_location.longitude
          )
        }
      >
        <Text style={styles.buttonText}>Route to Vendor</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order ID: {orderId}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  receivedButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginTop: 10,
  },
  routeButton: {
    backgroundColor: "#3498DB",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default OrderItemsScreen;
