import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGuTFe_0Mz45m7v7ELUHOA-mY5ui9P-rE",
  authDomain: "suivi-de-maintenance-lentilles.firebaseapp.com",
  projectId: "suivi-de-maintenance-lentilles",
  storageBucket: "suivi-de-maintenance-lentilles.firebasestorage.app",
  messagingSenderId: "889439912929",
  appId: "1:889439912929:web:1c60e331021252b2c788a0"
};

// FIX: Switched to a more robust initialization pattern using getApp() to avoid potential issues.
// This addresses the "not a module" error which can sometimes be a symptom of configuration issues.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exporte une référence à la base de données Firestore
export const db = getFirestore(app);
