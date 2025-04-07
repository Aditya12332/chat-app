// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBTC3evtRG9cRcP5rSBNXpATkKkQfcS4Ss",
  authDomain: "chat-app-68158.firebaseapp.com",
  projectId: "chat-app-68158",
  storageBucket: "chat-app-68158.appspot.com", // fixed typo: should be .appspot.com
  messagingSenderId: "469581988525",
  appId: "1:469581988525:web:23c118e4b80d290c47fc24",
  measurementId: "G-QT3EBN88HG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Set up services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, signOut, db };
