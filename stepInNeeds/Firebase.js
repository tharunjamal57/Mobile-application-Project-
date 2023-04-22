import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQCzB4Lbazlx-fu6Ihx7Fio_OL-_oSS50",
  authDomain: "grocery-mart-83803.firebaseapp.com",
  projectId: "grocery-mart-83803",
  storageBucket: "grocery-mart-83803.appspot.com",
  messagingSenderId: "417047362850",
  appId: "1:417047362850:web:f20fe187eb1e48bea7797b",
  measurementId: "G-9RV0NK3QQR"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); 