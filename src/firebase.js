// src/firebase.js
// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object (replace with your config from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyCpSGpItXg695TUCfHmZ1kuGchJ_ncdSsk",
    authDomain: "hackathon-batch10.firebaseapp.com",
    projectId: "hackathon-batch10",
    storageBucket: "hackathon-batch10.appspot.com",
    messagingSenderId: "1061501553430",
    appId: "1:1061501553430:web:ee0f7ca112156da9f29e37"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
