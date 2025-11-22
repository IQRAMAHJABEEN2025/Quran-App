import type { User, HistoryItem, SurahMeta } from '../types';

const USERS_KEY = 'noor_app_users';
const SESSION_KEY = 'noor_app_session';

// Helper to get all users
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Register a new user
export const registerUser = (name: string, email: string, pass: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate network delay (Ultra fast now)
      const users = getUsers();
      if (users.find(u => u.email === email)) {
        reject(new Error('User already exists with this email.'));
        return;
      }
      
      const newUser: User = {
        name,
        email,
        password: pass,
        history: []
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Do NOT set session key. User must login manually.
      resolve(newUser);
    }, 100); // Reduced to 100ms for instant feel
  });
};

// Login user
export const loginUser = (email: string, pass: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === pass);
      
      if (!user) {
        reject(new Error('Invalid email or password.'));
        return;
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      resolve(user);
    }, 100); // Reduced to 100ms for instant feel
  });
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

// Check session
export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

// Add to History
export const addToHistory = (surah: SurahMeta) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === currentUser.email);

  if (userIndex === -1) return;

  // Create history item
  const historyItem: HistoryItem = {
    surahNumber: surah.number,
    surahName: surah.name,
    englishName: surah.englishName,
    timestamp: Date.now()
  };

  // Remove existing entry for this Surah if exists (to move it to top)
  let history = users[userIndex].history.filter(h => h.surahNumber !== surah.number);
  
  // Add to beginning
  history.unshift(historyItem);
  
  // Limit history to 20 items
  if (history.length > 20) history = history.slice(0, 20);

  users[userIndex].history = history;
  currentUser.history = history;

  // Save back to storage
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  
  return currentUser; // Return updated user
};