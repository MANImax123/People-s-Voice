
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "peoples-voice-8g03q",
  appId: "1:35443434280:web:1603779b65b7080ab7661d",
  storageBucket: "peoples-voice-8g03q.firebasestorage.app",
  apiKey: "AIzaSyAUe7Aa0y8NDak_rSMqq4NMoNSr2Glz3t0",
  authDomain: "peoples-voice-8g03q.firebaseapp.com",
  messagingSenderId: "35443434280",
  measurementId: "G-9T4C1J8B1Q"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
