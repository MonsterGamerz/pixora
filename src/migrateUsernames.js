// src/scripts/migrateUsernames.js
import { db } from "../firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export const migrateUsernames = async () => {
  try {
    const usersSnap = await getDocs(collection(db, "users"));

    for (const userDoc of usersSnap.docs) {
      const data = userDoc.data();
      const cleanUsername = data.username?.trim().toLowerCase();

      if (cleanUsername) {
        // create mapping in /usernames
        await setDoc(doc(db, "usernames", cleanUsername), {
          uid: userDoc.id,
        });
        console.log(`Mapped ${cleanUsername} → ${userDoc.id}`);
      }
    }

    console.log("✅ Migration complete!");
  } catch (err) {
    console.error("Migration error:", err);
  }
};
