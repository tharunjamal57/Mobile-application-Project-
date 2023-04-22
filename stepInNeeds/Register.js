import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { getAuth, createUserWithEmailAndPassword, inMemoryPersistence } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore"; 
import {db} from "./Firebase";

export default function Register({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [userType, setUserType] = React.useState('customer');
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleRegister = () => {
    // TODO: Handle registration logic here
    console.log(`Username: ${username}, Password: ${password}, Confirm Password: ${confirmPassword}, User Type: ${userType}`);

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, username, password).then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      const [isCustomer, isVendor, isCarrier] = [userType === "customer", userType === "vendor", userType === "carrier"];
      try {
        const docRef = addDoc(collection(db, 'users'), {
          is_customer: isCustomer,
          is_vendor: isVendor,
          is_carrier: isCarrier,
          user_id : user['uid'],
        });
        console.log("Document written with ID: ", docRef);
      }
      catch(error){
        console.log(error.message);
        const pattern = /\(([^)]+)\)/;
        const errorMessage = pattern.exec(error.message)[1];
        setErrorMessage(errorMessage);
      }
      navigation.navigate('Login');
    }).catch((error) => {
      console.log(error.message);
      const pattern = /\(([^)]+)\)/;
      const errorMessage = pattern.exec(error.message)[1];
      setErrorMessage(errorMessage);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step in Needs</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={(text) => setUsername(text.toLowerCase())}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={userType}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue, itemIndex) => setUserType(itemValue.toLowerCase())}
            pickerStyle={{ fontFamily: 'monospace' }}
          >
            <Picker.Item label="Customer" value="customer" />
            <Picker.Item label="Vendor" value="vendor" />
            <Picker.Item label="Carrier" value="carrier" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  form: {
    width: '80%',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'monospace',
    fontSize: 18,
    marginBottom: 16,
    width: '100%',
  },  
  pickerContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontFamily: 'monospace',
  },
  button: {
    marginLeft : '10%',
    marginRight : '10%',
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 16,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    elevation: 5

  },
  buttonText: {
    color: '#f9f9f9',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  errorMessage:{
    color: "red",
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'monospace',
    marginTop: 10,
    textAlign: 'center',
  },  
});