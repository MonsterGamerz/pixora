// src/utils/syncUsernames.js
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const syncUserData = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create Firestore doc for old users
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      username: user.email.split("@")[0], // fallback if no username
      createdAt: new Date(),
    });
  } else {
    // If exists but missing username → patch it
    const data = userSnap.data();
    if (!data.username) {
      await setDoc(userRef, {
        ...data,
        username: user.email.split("@")[0],
      }, { merge: true });
    }
  }
};
