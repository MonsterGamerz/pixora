// src/firebase.js
// trigger redeploy

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD_C_sauX1gF1fLtoSiuG2p7LzC9jwi3I8",
  authDomain: "pixora-90444.firebaseapp.com",
  projectId: "pixora-90444",
  storageBucket: "pixora-90444.appspot.com", // 🔧 fix here (was wrong in your snippet)
  messagingSenderId: "317901408418",
  appId: "1:317901408418:web:59955b78c184503ccd6ffb"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
