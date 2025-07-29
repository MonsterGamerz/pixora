// Import Firebase core and services
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBFnWofix2tPISpu3JlXIYyTC1z8r3Oz-4",
  authDomain: "pixora-nig.firebaseapp.com",
  projectId: "pixora-nig",
  storageBucket: "pixora-nig.appspot.com",
  messagingSenderId: "836132008991",
  appId: "1:836132008991:web:ff5818a5ed5d9d0b84512a",
  measurementId: "G-JWJDCVMM59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Make login persist after refresh
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Firebase auth persistence set to local");
  })
  .catch((err) => {
    console.error("❌ Persistence error:", err);
  });

export { app, auth, db, storage };
