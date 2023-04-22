import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = ({ deviceAddress, handlePressCart }) => {
  const navigation = useNavigation();

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        {/* Cart */}  
        <TouchableOpacity style={styles.cartIconContainer} onPress={handlePressCart}>
          <Image source={require('./assets/cartLogo.png')} style={styles.cartIcon} />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
        {/* Profile logo */}
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.profileLogo}
          />
        </TouchableOpacity>
        {/* Location */}
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Location:</Text>
          <Text style={styles.locationText}>{deviceAddress}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products"
        />
      </View>
    </>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      backgroundColor: '#2ECC71',
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 30,
      paddingBottom: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    cartIconContainer: {
      position: 'absolute',
      top: 50,
      right: 20,
    },
    cartIcon: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
    },
    cartBadge: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: 'red',
      borderRadius: 20,
      paddingHorizontal: 6,
      paddingVertical: 2,
      minWidth: 20,
      minHeight: 20,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    cartBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    profileLogo: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationTitle: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      fontFamily: 'monospace',
      marginRight: 5,
    },
    locationText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'monospace',
    },
    searchContainer: {
      backgroundColor: '#fff',
      marginHorizontal: 20,
      marginTop: -30,
      marginBottom: 20,
      borderRadius: 8,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    searchInput: {
      fontFamily: 'monospace',
      fontSize: 16,
      fontWeight: 'bold',
    },
    trendingContainer: {
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 10,
    },
    trendingTitle: {
      fontFamily: 'monospace',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    trendingItem: {
      backgroundColor: '#fff',
      borderRadius: 8,
      width: 120,
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
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
    trendingItemImage: {
      width: 80,
      height: 80,
      marginBottom: 10,
    },
    trendingItemTitle: {
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    trendingItemPrice: {
      fontFamily: 'monospace',
      fontSize: 12,
      color: '#666',
      textAlign: 'center',
    },
    categoriesContainer: {
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 10,
    },
    categoriesTitle: {
      fontFamily: 'monospace',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    categoryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    category: {
      backgroundColor: '#fff',
      borderRadius: 8,
      width: '48%',
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    categoryImage: {
      width: 60,
      height: 60,
      marginBottom: 10,
    },
    categoryTitle: {
      fontFamily: 'monospace',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
      popupContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    popupBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    popupImage: {
      width: 120,
      height: 120,
      marginBottom: 10,
    },
    popupTitle: {
      fontFamily: 'monospace',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    popupPrice: {
      fontFamily: 'monospace',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    popupButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    popupButton: {
      backgroundColor: '#2ECC71',
      borderRadius: 8,
      padding: 10,
      width: '48%',
    },
      popupButtonText: {
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      },
    });

export default Header;
