import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from './Firebase';
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderStatus = () => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isPackaged, setIsPackaged] = useState(false);
  const [isOnTheWay, setIsOnTheWay] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [billingDetails, setBillingDetails] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  useEffect(() => {
    const getOrderStatus = async () => {
      // Get the order ID from AsyncStorage
      const orderIdFromStorage = await AsyncStorage.getItem('orderId');
      console.log(orderIdFromStorage);
      setOrderId(orderIdFromStorage);

      // Fetch the order document from Firestore
      const orderDoc = doc(db, 'customer_orders', orderIdFromStorage);
      console.log(orderDoc);
      const snap = await getDoc(orderDoc);
      if (snap.exists()) {
        const data = snap.data();
        setIsOrderPlaced(data.is_order_placed);
        setIsPackaged(data.is_packaged);
        setIsOnTheWay(data.is_one_the_way);
        setIsDelivered(data.is_delivered);
        setBillingDetails(data.billing_details);
      }

      return () => {
        unsubscribe();
      };
    };
    getOrderStatus();
  }, []);

  return (
    <View style={styles.container}>
      {orderId ? (
        <View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Order Status</Text>
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>Order placed</Text>
              {isOrderPlaced && <Text style={styles.statusIcon}>✅</Text>}
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>Order packaged</Text>
              {isPackaged && <Text style={styles.statusIcon}>✅</Text>}
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>Order on the way</Text>
              {isOnTheWay && <Text style={styles.statusIcon}>✅</Text>}
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>Order delivered</Text>
              {isDelivered && <Text style={styles.statusIcon}>✅</Text>}
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Billing Details</Text>
            {billingDetails && (
              <View style={styles.details}>
                <Text style={styles.detailsLabel}>Name:</Text>
                <Text style={styles.detailsText}>{billingDetails.name}</Text>
                <Text style={styles.detailsLabel}>Email:</Text>
                <Text style={styles.detailsText}>{billingDetails.email}</Text>
                <Text style={styles.detailsLabel}>Address:</Text>
                <Text style={styles.detailsText}>{billingDetails.address}</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  statusContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ECC71',
    textTransform: 'capitalize',
  },
  statusIcon: {
    fontSize: 20,
  },
  detailsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  details: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    textAlign: 'center',
  },
});


export default OrderStatus;
