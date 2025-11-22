import firebase from "firebase/compat/app";
import { auth, database, googleProvider } from '../firebase';
import type { User, HistoryItem, SurahMeta } from '../types';

// --- Helper: Convert Firebase User + Database Data to App User ---
const formatUser = (fbUser: firebase.User, userData: any): User => {
  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    name: userData?.name || fbUser.displayName || 'User',
    history: userData?.history || []
  };
};

// --- 1. Subscribe to Auth Changes (Realtime DB Version) ---
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(async (fbUser) => {
    if (fbUser) {
      // STEP 1: INSTANT UI UPDATE
      // Send basic user data immediately so the app opens instantly.
      const basicUser: User = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || 'User',
        history: [] 
      };
      callback(basicUser);

      // STEP 2: BACKGROUND DATA FETCH (Realtime Database)
      try {
        const userRef = database.ref(`users/${fbUser.uid}`);
        
        // Fetch data once
        userRef.once('value').then((snapshot) => {
          const userData = snapshot.val();
          
          if (userData) {
            // User exists, update UI with full data
            callback(formatUser(fbUser, userData));
          } else {
            // If user is new (via Google), create the node in background
            const newUserDoc = {
              name: basicUser.name,
              email: basicUser.email,
              history: []
            };
            userRef.set(newUserDoc).catch(console.error);
          }
        });

      } catch (error) {
        console.error("Background fetch failed, keeping basic user session:", error);
      }
    } else {
      callback(null);
    }
  });
};

// --- 2. Register with Email/Password ---
export const registerUser = async (name: string, email: string, pass: string): Promise<void> => {
  try {
    // Create Auth User
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    const fbUser = userCredential.user;

    if (fbUser) {
        // Update Profile Async
        fbUser.updateProfile({ displayName: name }).catch(console.error);

        // Create Realtime Database Node
        await database.ref(`users/${fbUser.uid}`).set({
          name: name,
          email: email,
          history: []
        });
    }
    
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};

// --- 3. Login with Email/Password ---
export const loginUser = async (email: string, pass: string): Promise<void> => {
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (error: any) {
    throw new Error('Invalid email or password.');
  }
};

// --- 4. Google Sign In ---
export const loginWithGoogle = async (): Promise<void> => {
  try {
    await auth.signInWithPopup(googleProvider);
  } catch (error: any) {
    throw new Error(error.message || 'Google Sign In failed');
  }
};

// --- 5. Logout ---
export const logoutUser = async () => {
  await auth.signOut();
};

// --- 6. Add to History (Realtime Database) ---
export const addToHistory = async (surah: SurahMeta) => {
  const fbUser = auth.currentUser;
  if (!fbUser) return;

  const userRef = database.ref(`users/${fbUser.uid}`);
  
  try {
    const snapshot = await userRef.once('value');
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      let history = (userData.history as HistoryItem[]) || [];
      
      // Remove existing entry for this Surah to avoid duplicates
      history = history.filter(h => h.surahNumber !== surah.number);
      
      // Add to top
      const newItem: HistoryItem = {
        surahNumber: surah.number,
        surahName: surah.name,
        englishName: surah.englishName,
        timestamp: Date.now()
      };
      history.unshift(newItem);
      
      // Limit to 20 items
      if (history.length > 20) history = history.slice(0, 20);

      // Update Realtime DB
      await userRef.update({ history });
      
      // Return updated user structure for immediate UI update
      return formatUser(fbUser, { ...userData, history });
    }
  } catch (err) {
    console.error("Error updating history:", err);
  }
};