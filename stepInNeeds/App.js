import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import Register from "./Register";
import CustomerLandingPage from "./CustomerLandingPage";
import { initializeApp } from "firebase/app";
import Cart from "./Cart";
import Profile from "./Profile";
import Checkout from "./Checkout";
import CategoricalItems from "./CategoricalItems";
import { useAuth, AuthProvider } from "./AuthContext";
import OrderStatus from "./OrderStatus";
import VendorLandingPage from "./VendorLandingPage";
import VendorItems from "./VendorItems";
import OrderRequests from "./OrderRequests";
import OrderDetails from "./OrderDetails";
import CarrierLandingPage from "./CarrierLandingPage";
import OrderItemsScreen from "./OrderItemsScreen";
import VendorRouteMap from "./VendorRouteMap";
import CustomerRouteMap from "./CustomerRouteMap";
import Delivered from "./Delivered";

const firebaseConfig = {
  apiKey: "AIzaSyBQCzB4Lbazlx-fu6Ihx7Fio_OL-_oSS50",
  authDomain: "grocery-mart-83803.firebaseapp.com",
  projectId: "grocery-mart-83803",
  storageBucket: "grocery-mart-83803.appspot.com",
  messagingSenderId: "417047362850",
  appId: "1:417047362850:web:f20fe187eb1e48bea7797b",
  measurementId: "G-9RV0NK3QQR",
};

const app = initializeApp(firebaseConfig);
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomerLandingPage"
            component={CustomerLandingPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Cart"
            component={Cart}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CategoricalItems"
            component={CategoricalItems}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderStatus"
            component={OrderStatus}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VendorLandingPage"
            component={VendorLandingPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderDetails"
            component={OrderDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VendorItems"
            component={VendorItems}
            options={{
              title: "My Items",
              headerStyle: {
                backgroundColor: "#2ECC71",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="OrderRequests"
            component={OrderRequests}
            options={{
              title: "Order Requests",
              headerStyle: {
                backgroundColor: "#2ECC71",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="CarrierLandingPage"
            component={CarrierLandingPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderItemsScreen"
            component={OrderItemsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VendorRouteMap"
            component={VendorRouteMap}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="CustomerRouteMap" component={CustomerRouteMap} />
          <Stack.Screen
            name="Delivered"
            component={Delivered}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("./assets/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Step in Needs</Text>
        <Text style={styles.subtitle}>Please login or register</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    backgroundColor: "#e3f2fd",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    marginTop: 16,
    fontFamily: "monospace",
    fontWeight: 700,
    fontStyle: "italic",
    color: "black",
    textShadowColor: "white",
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: "#2ECC71",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 16,
    width: "80%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    elevation: 5,
  },
  buttonText: {
    color: "#f9f9f9",
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
});
