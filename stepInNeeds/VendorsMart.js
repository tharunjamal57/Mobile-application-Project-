import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

function VendorsMart({ vendorName, handlePressItem, handleAddToCart }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      // Fetch items from Firebase Cloud Firestore for the selected vendor
      const itemsQuery = query(
        collection(db, "items"),
        where("vendor_name", "==", vendorName)
      );
      const itemsSnapshot = await getDocs(itemsQuery);
      const itemsData = itemsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setItems(itemsData);
    };
    fetchItems();
  }, [vendorName]);

  return (
    <View style={styles.itemsContainer}>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <TouchableOpacity onPress={() => handlePressItem(item)}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}/lb</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAddToCart(item)}>
            <Text style={styles.itemAddToCart}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  vendorItemsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  vendorItemsTitle: {
    fontFamily: "monospace",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  vendorItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  vendorItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "48%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  vendorItemImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  vendorItemTitle: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  vendorItemPrice: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default VendorsMart;
