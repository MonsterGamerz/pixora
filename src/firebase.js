// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFnWofix2tPISpu3JlXIYyTC1z8r3Oz-4",
  authDomain: "pixora-nig.firebaseapp.com",
  projectId: "pixora-nig",
  storageBucket: "pixora-nig.appspot.com",
  messagingSenderId: "836132008991",
  appId: "1:836132008991:web:ff5818a5ed5d9d0b84512a",
  measurementId: "G-JWJDCVMM59"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
