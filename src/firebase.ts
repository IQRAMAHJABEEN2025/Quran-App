import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyBQaZ08MQRiyG3_lgmiqEixuub9VRj-2xg",
  authDomain: "quran-app-2a748.firebaseapp.com",
  projectId: "quran-app-2a748",
  storageBucket: "quran-app-2a748.firebasestorage.app",
  messagingSenderId: "720540224444",
  appId: "1:720540224444:web:e9ec095d35165b2acbf9b9",
  measurementId: "G-PNB4SF1FHS"
};

// Initialize Firebase
// Check if firebase app is already initialized to avoid errors
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Exports
export const auth = app.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
// Initialize Realtime Database instead of Firestore
export const database = app.database();

export default firebase;