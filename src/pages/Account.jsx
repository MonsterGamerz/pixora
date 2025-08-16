import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Account = () => {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          // Fallback: if username is missing, use displayName or email
          if (!data.username) {
            data.username = data.displayName || data.email?.split("@")[0] || "Unknown User";
          }

          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserData(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [uid]);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>User not found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{userData.username}</h2>
      <p>{userData.email}</p>
    </div>
  );
};

export default Account;
