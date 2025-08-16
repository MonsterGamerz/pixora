import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const handleSignup = async (email, password, username) => {
  try {
    // create auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // store extra info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      username: username,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
};
