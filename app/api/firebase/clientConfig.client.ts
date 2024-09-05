import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: window.ENV.FIREBASE_API_KEY,
  authDomain: window.ENV.FIREBASE_APP_AUTH_DOMAIN,
  projectId: window.ENV.FIREBASE_APP_PROJECT_ID,
  storageBucket: window.ENV.FIREBASE_APP_STORAGE_BUCKET,
  messagingSenderId: window.ENV.FIREBASE_APP_SENDER_ID,
  appId: window.ENV.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export { app, auth, db, provider };
