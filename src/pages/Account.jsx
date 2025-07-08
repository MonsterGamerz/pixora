import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
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

export default function Account() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const viewingId = id || currentUser.uid;
  const isOwnProfile = viewingId === currentUser.uid;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Subscribe to profile data
    const unsubProfile = onSnapshot(doc(db, 'users', viewingId), snap => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setIsFollowing(data.followers?.includes(currentUser.uid));
      }
    });

    // Subscribe to posts by this user
    const postsQuery = query(
      collection(db, 'posts'),
      where('userId', '==', viewingId)
    );
    const unsubPosts = onSnapshot(postsQuery, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubProfile();
      unsubPosts();
    };
  }, [viewingId, currentUser.uid]);

  const toggleFollow = async () => {
    const meRef = doc(db, 'users', currentUser.uid);
    const themRef = doc(db, 'users', viewingId);

    if (isFollowing) {
      await updateDoc(themRef, { followers: arrayRemove(currentUser.uid) });
      await updateDoc(meRef, { following: arrayRemove(viewingId) });
    } else {
      await updateDoc(themRef, { followers: arrayUnion(currentUser.uid) });
      await updateDoc(meRef, { following: arrayUnion(viewingId) });
    }
  };

  if (!profile) return <p className="p-4 text-center">Loading profile...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">@{profile.username}</h2>
          <p className="text-sm text-gray-600">{profile.bio}</p>
        </div>
        {isOwnProfile ? (
          <button
            onClick={() => navigate('/edit-profile')}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={toggleFollow}
            className={`px-3 py-1 rounded text-white ${
              isFollowing ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <span>{profile.followers?.length || 0} Followers</span> ·{' '}
        <span>{profile.following?.length || 0} Following</span>
      </div>

      <h3 className="font-semibold mb-2">{isOwnProfile ? 'Your Posts' : 'Posts'}</h3>
      <div className="grid grid-cols-2 gap-2">
        {posts.map(post =>
          post.type === 'image' ? (
            <img
              key={post.id}
              src={post.url}
              alt="post"
              className="w-full h-32 object-cover rounded"
            />
          ) : (
            <video
              key={post.id}
              src={post.url}
              controls
              className="w-full h-32 object-cover rounded"
            />
          )
        )}
      </div>
    </div>
);
}
