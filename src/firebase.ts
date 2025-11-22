import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

// Fix for TypeScript error: Property 'env' does not exist on type 'ImportMeta'
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// SECURITY UPDATE:
// Configuration is now loaded from Environment Variables.
// Create a .env file in your project root and add these values there.
// Do not commit .env file to GitHub.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// Check if firebase app is already initialized to avoid errors
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Exports
export const auth = app.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
// Initialize Realtime Database
export const database = app.database();

export default firebase;