// src/pages/Account.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function Account() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get UID from username
        const userMapRef = doc(db, "usernames", username);
        const userMapSnap = await getDoc(userMapRef);

        if (!userMapSnap.exists()) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const { uid } = userMapSnap.data();

        // Get profile data
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfile({ ...data, uid });

          // check if logged in user follows them
          if (user) {
            const currentUserRef = doc(db, "users", user.uid);
            const currentUserSnap = await getDoc(currentUserRef);
            if (
              currentUserSnap.exists() &&
              currentUserSnap.data().following?.includes(uid)
            ) {
              setIsFollowing(true);
            }
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user]);

  const handleFollowToggle = async () => {
    if (!user || !profile) return;

    try {
      const currentUserRef = doc(db, "users", user.uid);
      const profileRef = doc(db, "users", profile.uid);

      if (isFollowing) {
        // Unfollow
        await updateDoc(currentUserRef, {
          following: arrayRemove(profile.uid),
        });
        await updateDoc(profileRef, {
          followers: arrayRemove(user.uid),
        });
        setIsFollowing(false);
        setProfile((prev) => ({
          ...prev,
          followers: prev.followers.filter((id) => id !== user.uid),
        }));
      } else {
        // Follow
        await updateDoc(currentUserRef, {
          following: arrayUnion(profile.uid),
        });
        await updateDoc(profileRef, {
          followers: arrayUnion(user.uid),
        });
        setIsFollowing(true);
        setProfile((prev) => ({
          ...prev,
          followers: [...prev.followers, user.uid],
        }));
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-20 text-white">User not found</div>;
  }

  const isOwnProfile = user && user.uid === profile.uid;

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-6">
      <img
        src={profile.photoURL || "https://via.placeholder.com/100"}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover border-2 border-pink-500 mb-4"
      />
      <h2 className="text-2xl font-bold">{profile.username}</h2>
      <p className="text-gray-400">{profile.email}</p>
      <p className="mt-3 text-center">{profile.bio || "No bio yet."}</p>

      <div className="flex gap-6 mt-5">
        <div className="text-center">
          <p className="font-bold">{profile.followers?.length || 0}</p>
          <p className="text-sm text-gray-400">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{profile.following?.length || 0}</p>
          <p className="text-sm text-gray-400">Following</p>
        </div>
      </div>

      {isOwnProfile ? (
        <Link
          to="/edit-profile"
          className="mt-6 bg-pink-600 hover:bg-pink-700 transition rounded px-6 py-2 font-semibold"
        >
          Edit Profile
        </Link>
      ) : (
        <button
          onClick={handleFollowToggle}
          className={`mt-6 px-6 py-2 rounded font-semibold transition ${
            isFollowing
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
