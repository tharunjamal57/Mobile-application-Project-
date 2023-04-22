import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { db } from "./Firebase";
import { useAuth } from "./AuthContext";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { NavigationRouteContext } from "@react-navigation/native";

const OrderDetailsScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const { user } = useAuth();

  useEffect(() => {
    getStatus();
  }, []);
  const getStatus = () => {
    const { order } = route.params;
    if (order.is_delivered) {
      return "Delivered";
    } else if (order.is_one_the_way) {
      return "On the Way";
    } else if (order.is_packaged) {
      return "Packaged";
    } else if (order.is_order_placed) {
      return "Order Placed";
    } else {
      return "Unknown";
    }
  };

  const updateItemStatus = async (orderId, itemId, status) => {
    try {
      const itemsRef = collection(db, `customer_orders/${orderId}/items`);
      const querySnapshot = await getDocs(itemsRef);
      const items = querySnapshot.docs.map((itemDoc) => ({
        id: itemDoc.id,
        ...itemDoc.data(),
      }));
      const item = items.find((item) => item.item_id === itemId);
      if (status === "packaged") {
        await updateDoc(doc(db, `customer_orders/${orderId}/items`, item.id), {
          is_packaged: true,
        });

        const itemsSnapshot = await getDocs(
          collection(db, `customer_orders/${orderId}/items`)
        );

        const items = itemsSnapshot.docs
          .map((itemDoc) => itemDoc.data())
          .filter((item) => item.vendor_id === user.uid);

        // Check the status of all items
        const allItemsPackaged = items.every((item) => item.is_packaged);
        await updateDoc(doc(db, "customer_orders", orderId), {
          is_packaged: allItemsPackaged,
        });
      } else if (status === "rejected") {
        await updateDoc(doc(db, `customer_orders/${orderId}/items`, item.id), {
          is_packaged: true,
        });
      }
      navigation.navigate("VendorLandingPage");
    } catch (error) {
      console.log("Error updating item status:", error);
    }
  };

  const getItemStatus = (item) => {
    if (item.is_delivered) {
      return "Delivered";
    } else if (item.is_out_for_delivery) {
      return "On the Way";
    } else if (item.is_packaged) {
      return "Packaged";
    } else if (item.is_order_placed) {
      return "Order Placed";
    } else {
      return "Unknown";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text style={styles.itemInfo}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemInfo}>Price: {item.price}</Text>
      <Text style={styles.itemStatus}>Status: {getItemStatus(item)}</Text>
      {/* Add this line */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.packagedButton}
          onPress={() => updateItemStatus(order.id, item.item_id, "packaged")}
        >
          <Text style={styles.buttonText}>Item Packaged</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => updateItemStatus(order.id, item.item_id, "rejected")}
        >
          <Text style={styles.buttonText}>Reject Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order ID: {order.id}</Text>
      <Text style={styles.status}>Status: {getStatus()}</Text>
      <Text style={styles.date}>
        Date Ordered: {order.date_ordered?.toDate().toLocaleString()}
      </Text>
      <FlatList
        data={order.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.item_id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  listContent: {
    padding: 20,
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
  itemImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 5,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  packagedButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  rejectButton: {
    backgroundColor: "#E74C3C",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default OrderDetailsScreen;
