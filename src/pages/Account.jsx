// src/pages/Account.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "usernames", username); // 👈 mapping usernames → uid
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const { uid } = userSnap.data();
          const profileRef = doc(db, "users", uid);
          const profileSnap = await getDoc(profileRef);

          if (profileSnap.exists()) {
            setProfile({ uid, ...profileSnap.data() });

            // check if current user follows them
            if (user) {
              setIsFollowing(profileSnap.data().followers.includes(user.uid));
            }
          }
        } else {
          console.log("Profile not found");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user]);

  const handleFollow = async () => {
    if (!user) return navigate("/login");

    try {
      const targetRef = doc(db, "users", profile.uid);
      const currentRef = doc(db, "users", user.uid);

      if (isFollowing) {
        await updateDoc(targetRef, { followers: arrayRemove(user.uid) });
        await updateDoc(currentRef, { following: arrayRemove(profile.uid) });
        setIsFollowing(false);
      } else {
        await updateDoc(targetRef, { followers: arrayUnion(user.uid) });
        await updateDoc(currentRef, { following: arrayUnion(profile.uid) });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center text-white mt-20">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center text-red-500 mt-20">User not found</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 text-white">
      <img
        src={profile.photoURL || "https://via.placeholder.com/100"}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border-2 border-pink-500"
      />
      <h2 className="mt-4 text-xl font-bold">{profile.username}</h2>
      <p className="text-gray-400">{profile.bio || "No bio yet"}</p>

      <div className="flex gap-6 mt-4">
        <p><span className="font-bold">{profile.followers.length}</span> Followers</p>
        <p><span className="font-bold">{profile.following.length}</span> Following</p>
      </div>

      {user?.uid === profile.uid ? (
        <Link
          to="/edit-profile"
          className="mt-4 px-4 py-2 bg-pink-600 rounded hover:bg-pink-700 transition"
        >
          Edit Profile
        </Link>
      ) : (
        <button
          onClick={handleFollow}
          className="mt-4 px-4 py-2 bg-pink-600 rounded hover:bg-pink-700 transition"
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
