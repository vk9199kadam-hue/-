import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id",
};

let firebaseInitialized = false;

try {
  const hasRealCredentials = firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "your-api-key" &&
    firebaseConfig.projectId !== "your-project-id" &&
    firebaseConfig.authDomain !== "your-project.firebaseapp.com";

  if (hasRealCredentials && getApps().length === 0) {
    initializeApp(firebaseConfig);
    firebaseInitialized = true;
  } else if (getApps().length > 0) {
    firebaseInitialized = true;
  }
} catch (error) {
  console.warn('Firebase initialization skipped:', error);
  firebaseInitialized = false;
}

const app = getApps()[0] || null;

export const auth = firebaseInitialized && app ? getAuth(app) : null;
export const db = firebaseInitialized && app ? getFirestore(app) : null;
export const storage = firebaseInitialized && app ? getStorage(app) : null;
export const isFirebaseReady = firebaseInitialized;

export default app;
