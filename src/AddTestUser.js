// src/AddTestUser.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function addTestUser() {
  try {
    const testUid = "test123";

    // Add to users collection
    await setDoc(doc(db, "users", testUid), {
      uid: testUid,
      username: "testuser",
      email: "test@pixora.com",
      bio: "This is a test bio 🚀",
      photoURL: "https://via.placeholder.com/150",
      followers: [],
      following: [],
    });

    // Add to usernames collection
    await setDoc(doc(db, "usernames", "testuser"), {
      uid: testUid,
    });

    console.log("✅ Test user created successfully!");
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  }
}
