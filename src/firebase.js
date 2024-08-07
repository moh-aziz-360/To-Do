// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAr1KImHLmIlMuZxjbuzUgrRBzFydtdr4k",
  authDomain: "todo-app-3e0fc.firebaseapp.com",
  projectId: "todo-app-3e0fc",
  storageBucket: "todo-app-3e0fc.appspot.com",
  messagingSenderId: "850632260060",
  appId: "1:850632260060:web:d2ae97a8351a46250df719",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db };
