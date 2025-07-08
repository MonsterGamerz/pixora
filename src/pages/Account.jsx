import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

export default function Account() {
  const { id } = useParams();
  const currentUser = auth.currentUser;
  const [user, setUser] = useState(null);
  const [isOwn, setIsOwn] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const loadUser = async () => {
    const uid = id || currentUser.uid;
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser(data);
      setIsOwn(uid === currentUser.uid);
      setIsFollowing(data.followers?.includes(currentUser.uid));
    }
  };

  const toggleFollow = async () => {
    if (!user) return;
    const targetRef = doc(db, 'users', user.uid);
    const currentRef = doc(db, 'users', currentUser.uid);

    if (isFollowing) {
      await updateDoc(targetRef, { followers: arrayRemove(currentUser.uid) });
      await updateDoc(currentRef, { following: arrayRemove(user.uid) });
    } else {
      await updateDoc(targetRef, { followers: arrayUnion(currentUser.uid) });
      await updateDoc(currentRef, { following: arrayUnion(user.uid) });
    }

    setIsFollowing(!isFollowing);
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  if (!user) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-1">@{user.username}</h1>
      <p className="text-gray-600 mb-2">{user.email}</p>
      <p className="text-sm text-gray-500 mb-2">{user.bio || 'No bio yet.'}</p>
      <div className="flex gap-4 mb-4">
        <span><strong>{user.followers?.length || 0}</strong> Followers</span>
        <span><strong>{user.following?.length || 0}</strong> Following</span>
      </div>

      {!isOwn && (
        <button
          onClick={toggleFollow}
          className={`px-4 py-2 rounded ${isFollowing ? 'bg-gray-300 text-black' : 'bg-pink-500 text-white'}`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
}
