// src/pages/Account.jsx
import React, { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';

export default function Account() {
  const { id } = useParams();
  const userId = id || auth.currentUser?.uid;
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, 'users', userId), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setIsFollowing(docSnap.data().followers?.includes(auth.currentUser?.uid));
      }
    });

    const postQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const unsubPosts = onSnapshot(postQuery, (snap) => {
      setUserPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsub();
      unsubPosts();
    };
  }, [userId]);

  const toggleFollow = async () => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || !userId || userId === currentUserId) return;

    const targetRef = doc(db, 'users', userId);
    const currentRef = doc(db, 'users', currentUserId);

    const isFollowing = userData.followers?.includes(currentUserId);

    await updateDoc(targetRef, {
      followers: isFollowing ? arrayRemove(currentUserId) : arrayUnion(currentUserId),
    });

    await updateDoc(currentRef, {
      following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {userData && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">@{userData.username}</h2>
            {userId === auth.currentUser?.uid ? (
              <button
                className="text-blue-500 text-sm"
                onClick={() => navigate('/edit-profile')}
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={toggleFollow}
                className="bg-pink-500 text-white px-3 py-1 rounded text-sm"
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <p>{userData.followers?.length || 0} Followers</p>
            <p>{userData.following?.length || 0} Following</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {userPosts.map((post) =>
              post.type === 'image' ? (
                <img key={post.id} src={post.url} className="w-full h-32 object-cover rounded" />
              ) : (
                <video key={post.id} src={post.url} className="w-full h-32 object-cover rounded" />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
