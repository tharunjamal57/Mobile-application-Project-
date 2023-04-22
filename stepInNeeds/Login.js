import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { query, where, collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

export default function Login({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const { login } = useAuth();
  // if (isLoggedIn) {
  //   navigation.navigate('CustomerLandingPage');
  // }
  const handleCustomerLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        try {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
          console.log("Error storing user in AsyncStorage:", e);
        }
        const userRef = collection(db, "users");
        const q = query(userRef, where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          const data = querySnapshot.docs[0].data();
          const { is_customer, is_vendor, is_carrier } = data;
          console.log(data);
          if (!!!is_customer) {
            throw new Error(
              "You are not an authorized customer, please try again with different creds"
            );
          }
        } else {
          throw new Error("invalid user data");
        }

        setErrorMessage("");
        login(user);
        navigation.navigate("CustomerLandingPage");
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  };

  const handleCarrierLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        try {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
          console.log("Error storing user in AsyncStorage:", e);
        }
        const userRef = collection(db, "users");
        const q = query(userRef, where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          const data = querySnapshot.docs[0].data();
          const { is_customer, is_vendor, is_carrier } = data;
          console.log(data);
          if (!!!is_carrier) {
            throw new Error(
              "You are not an authorized Carrier, please try again with different creds"
            );
          }
        } else {
          throw new Error("invalid user data");
        }

        setErrorMessage("");
        login(user);
        navigation.navigate("CarrierLandingPage");
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  };

  const handleVendorLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        try {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
          console.log("Error storing user in AsyncStorage:", e);
        }
        const userRef = collection(db, "users");
        const q = query(userRef, where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          const data = querySnapshot.docs[0].data();
          const { is_customer, is_vendor, is_carrier } = data;
          console.log(data);
          if (!!!is_vendor) {
            throw new Error(
              "You are not an authorized Vendor, please try again with different creds"
            );
          }
        } else {
          throw new Error("invalid user data");
        }

        setErrorMessage("");
        login(user);
        navigation.navigate("VendorLandingPage");
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step in Needs</Text>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleCustomerLogin}>
          <Text style={styles.buttonText}>Login as Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCarrierLogin}>
          <Text style={styles.buttonText}>Login as Carrier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleVendorLogin}>
          <Text style={styles.buttonText}>Login as Vendor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  form: {
    width: "80%",
    justifyContent: "center", // Add this line
  },
  errorMessage: {
    color: "red",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "monospace",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: "monospace",
    fontSize: 18,
    marginBottom: 16,
    width: "100%",
  },
  button: {
    marginLeft: "10%",
    marginRight: "10%",
    backgroundColor: "#2ECC71",
    paddingVertical: 16,
    paddingHorizontal: 30,
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
