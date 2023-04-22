import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "./AuthContext";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./Firebase";

export default function OrderRequests({ navigation }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "customer_orders"),
          where("is_order_placed", "==", true),
          where("is_packaged", "==", false)
        )
      );

      const ordersPromises = querySnapshot.docs.map(async (idoc) => {
        const orderId = idoc.id;
        const orderData = idoc.data();

        const itemsSnapshot = await getDocs(
          collection(db, `customer_orders/${orderId}/items`)
        );

        const items = itemsSnapshot.docs
          .map((itemDoc) => itemDoc.data())
          .filter((item) => item.vendor_id === user.uid);

        const allItemsOutForDelivery = items.every(
          (item) => item.is_out_for_delivery
        );
        const allItemsDelivered = items.every((item) => item.is_delivered);

        if (items.length > 0) {
          return {
            id: orderId,
            ...orderData,
            items,
            is_one_the_way: allItemsOutForDelivery,
            is_delivered: allItemsDelivered,
          };
        } else {
          return null;
        }
      });

      const orders = await Promise.all(ordersPromises);
      setOrders(orders.filter((order) => order !== null));
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: status,
      });
      fetchOrders();
    } catch (error) {
      console.log("Error updating order status:", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("OrderDetails", { order: item })}
      >
        <View style={styles.orderContainer}>
          <Text style={styles.orderId}>Order ID: {item.id}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Orders</Text>
      <FlatList
        data={orders}
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  listContent: {
    padding: 20,
  },
  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  packedButton: {
    backgroundColor: "#3498DB",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});
