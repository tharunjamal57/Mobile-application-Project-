import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Cart({ navigation }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("cart");
        const cart =
          jsonValue != null
            ? JSON.parse(jsonValue).filter(
                (item) =>
                  item.id &&
                  item.image &&
                  item.name &&
                  item.price &&
                  item.quantity &&
                  item.vendor_id
              )
            : [];
        console.log("jsonValue", jsonValue);
        setCartItems(cart);
      } catch (e) {
        console.log("Error fetching cart from AsyncStorage:", e);
      }
    };
    fetchCart();
  }, []);
  const calculateTotal = () => {
    const total = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    AsyncStorage.setItem("cartTotal", total.toString());
    return total;
  };
  const removeItem = async (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(newCartItems));
      setCartItems(newCartItems);
    } catch (e) {
      console.log("Error removing item from cart:", e);
    }
  };

  const increaseQuantity = (index) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity += 1;
    try {
      AsyncStorage.setItem("cart", JSON.stringify(newCartItems));
      setCartItems(newCartItems);
    } catch (e) {
      console.log("Error updating quantity in cart:", e);
    }
  };

  const decreaseQuantity = (index) => {
    const newCartItems = [...cartItems];
    if (newCartItems[index].quantity > 1) {
      newCartItems[index].quantity -= 1;
    } else {
      newCartItems.splice(index, 1);
    }
    try {
      AsyncStorage.setItem("cart", JSON.stringify(newCartItems));
      setCartItems(newCartItems);
    } catch (e) {
      console.log("Error updating quantity in cart:", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <View style={styles.emptyView} />
      </View>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <View style={styles.itemImageContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.minusButton}
                    onPress={() => decreaseQuantity(index)}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => increaseQuantity(index)}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeItem(index)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.itemContainer}
        />
      ) : (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      )}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalPrice}>${calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("Checkout")}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#0066cc",
    fontFamily: "monospace",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
    fontFamily: "monospace",
  },
  emptyView: {
    width: 50,
  },
  itemContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  minusButton: {
    backgroundColor: "#ddd",
    borderRadius: 15,
    padding: 8,
  },
  plusButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 15,
    padding: 8,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "monospace",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: "center",
    fontFamily: "monospace",
  },
  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCartText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
    fontFamily: "monospace",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
    marginTop: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "monospace",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "monospace",
  },
  checkoutButton: {
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
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
