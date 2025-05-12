import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  remove,
} from "firebase/database";

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB7XYxfnJjWTXdzhoNp0v2V-jdTON9Qci4",
  authDomain: "naqa-f6853.firebaseapp.com",
  databaseURL: "https://naqa-f6853-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "naqa-f6853",
  storageBucket: "naqa-f6853.firebasestorage.app",
  messagingSenderId: "63755712074",
  appId: "1:63755712074:web:9e5761c8d9e21c399598b3",
  measurementId: "G-Z71HS0ZRLH",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Services
const db = getDatabase(app);
const firestore = getFirestore(app);

// Export everything
export {
  auth,
  db,
  ref,
  onValue,
  set,
  push,
  update,
  remove,
  firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
};
