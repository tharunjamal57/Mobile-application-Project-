import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { db } from "./Firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function DeliveryGuyPage({ navigation }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "customer_orders"),
        where("is_order_placed", "==", true),
        where("is_packaged", "==", true),
        where("is_on_the_way", "==", false),
        where("is_delivered", "==", false)
      ),
      (querySnapshot) => {
        const orders = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
        setOrders(orders);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Delivery Guy Dashboard</Text>
      {orders.length > 0 ? (
        orders.map((order) => (
          <View key={order.id} style={styles.orderContainer}>
            <Text style={styles.orderLabel}>Order #{order.id}</Text>
            <View style={styles.orderInfo}>
              <Text style={styles.orderText}>
                Customer Name: {order.customer_name}
              </Text>
              <Text style={styles.orderText}>
                Total Amount: ${order.total_amount}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deliveredButton}
              onPress={() =>
                navigation.navigate("OrderItemsScreen", { orderId: order.id })
              }
            >
              <Text style={styles.deliveredButtonText}>See Items</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noOrdersText}>No orders to deliver</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "monospace",
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  orderLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "monospace",
  },
  orderInfo: {
    marginBottom: 10,
  },
  orderText: {
    fontFamily: "monospace",
  },
  deliveredButton: {
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
  deliveredButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  backButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  backButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
});
