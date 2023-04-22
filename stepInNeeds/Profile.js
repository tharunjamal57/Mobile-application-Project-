import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDocs, query, where, collection, limit } from 'firebase/firestore';
import {db} from './Firebase'
import { useAuth } from './AuthContext';
import { getAuth, signOut, firebase } from "firebase/auth";

export default function Profile({ navigation}){
  const [user, setUser] = useState({});
  const [place, setPlace] = useState({});
  const [orders, setOrders] = useState([]);

  const {logout} = useAuth();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
        const user = jsonValue != null ? JSON.parse(jsonValue) : {};
        setUser(user);
      } catch (e) {
        console.log('Error fetching user from AsyncStorage:', e);
      }
    };
  
    const fetchPlace = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('place');
        const place = jsonValue != null ? JSON.parse(jsonValue)[0] : {};
        setPlace(place);
      } catch (e) {
        console.log('Error fetching place from AsyncStorage:', e);
      }
    };
    
    const fetchOrders = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
        const userTmp = jsonValue != null ? JSON.parse(jsonValue) : {};
        const querySnapshot = await getDocs(
          query(
            collection(db, 'customer_orders'),
            where('customer_id', '==', userTmp.uid),
            limit(3)
          )
        );

        const orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(orders);
        setOrders(orders);
      } catch (e) {
        console.log('Error fetching orders:', e);
      }
    };
  
    fetchUser();
    fetchPlace();
    fetchOrders();
  }, []);
  

  const name = user.email ? user.email.split('@')[0] : '';

  async function handleLogout() {
    try {
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      
      // Remove all keys
      await AsyncStorage.multiRemove(keys);
  
      // Sign out of Firebase Auth and navigate to login screen
      const auth = getAuth();
      await signOut(auth);
      logout();
      navigation.navigate('Login');
    } catch (e) {
      console.log('Error logging out:', e);
      
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Location:</Text>
        <Text style={styles.infoText}>
          {place.name}, {place.city}, {place.country}
        </Text>
      </View>
      <View style={styles.ordersContainer}>
        <Text style={styles.ordersTitle}>Previous Orders:</Text>
        {orders.map((order, index) => (
          <View key={index} style={styles.order}>
            <Text style={styles.orderDate}>{order.date_ordered.toDate().toLocaleDateString()}</Text>
            <Text style={styles.orderTotal}>Total: ${order.price}</Text>
          </View>
        ))}
      </View>
      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>Need help?</Text>
        <Text style={styles.helpText}>
          If you have any questions or issues, please contact our customer support team at
          support@example.com.
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  ordersContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
  },
  ordersTitle: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  order: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  helpTitle: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
  