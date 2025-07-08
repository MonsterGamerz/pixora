// src/pages/Account.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Account() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setIsFollowing(data.followers?.includes(currentUser?.uid));
      }
    };

    if (uid) fetchUser();
  }, [uid, currentUser?.uid]);

  const handleFollow = async () => {
    if (!currentUser || currentUser.uid === uid) return;

    const myRef = doc(db, 'users', currentUser.uid);
    const theirRef = doc(db, 'users', uid);

    await updateDoc(myRef, {
      following: isFollowing ? arrayRemove(uid) : arrayUnion(uid)
    });

    await updateDoc(theirRef, {
      followers: isFollowing ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
    });

    setIsFollowing(!isFollowing);
  };

  if (!userData) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="p-4 text-white">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={userData.profilePic || '/default-avatar.png'}
          className="w-16 h-16 rounded-full object-cover"
          alt="profile"
        />
        <div>
          <h2 className="text-lg font-semibold">@{userData.username}</h2>
          <p className="text-sm text-gray-400">{userData.bio || 'No bio yet.'}</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <div>
          <p className="font-bold">{userData.followers?.length || 0}</p>
          <p className="text-xs text-gray-400">Followers</p>
        </div>
        <div>
          <p className="font-bold">{userData.following?.length || 0}</p>
          <p className="text-xs text-gray-400">Following</p>
        </div>
      </div>

      {currentUser?.uid !== uid && (
        <button
          onClick={handleFollow}
          className={`px-4 py-2 rounded font-semibold ${
            isFollowing ? 'bg-gray-800 text-white' : 'bg-pink-600 text-white'
          }`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
}
