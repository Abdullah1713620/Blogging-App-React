// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import getStorage

const firebaseConfig = {
    apiKey: "AIzaSyDeOEtPBoR0K_hyqtzLf03aTlBh3CwaOas",
    authDomain: "blogging-app-13a7b.firebaseapp.com",
    projectId: "blogging-app-13a7b",
    storageBucket: "blogging-app-13a7b.appspot.com",
    messagingSenderId: "1026907238691",
    appId: "1:1026907238691:web:1f137f11054b77dd6e9c96",
    measurementId: "G-HGDVRWPHXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage

export { auth, db, storage }; // Export storage
