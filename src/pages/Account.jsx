// src/pages/Account.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

export default function Account() {
  const { id } = useParams(); // optional user ID param
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isOwnAccount, setIsOwnAccount] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return navigate('/login');

      const viewingId = id || currentUser.uid;
      setUserId(viewingId);
      setIsOwnAccount(viewingId === currentUser.uid);

      const userRef = doc(db, 'users', viewingId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      setProfileData(userData);
      setFollowersCount(userData.followers?.length || 0);
      setFollowingCount(userData.following?.length || 0);

      if (id && userData.followers?.includes(currentUser.uid)) {
        setIsFollowing(true);
      }

      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('userId', '==', viewingId));
      const snap = await getDocs(q);
      setUserPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    fetchProfile();
  }, [id, navigate]);

  const toggleFollow = async () => {
    const currentUser = auth.currentUser;
    const currentRef = doc(db, 'users', currentUser.uid);
    const viewedRef = doc(db, 'users', userId);

    if (isFollowing) {
      await updateDoc(viewedRef, {
        followers: arrayRemove(currentUser.uid),
      });
      await updateDoc(currentRef, {
        following: arrayRemove(userId),
      });
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      await updateDoc(viewedRef, {
        followers: arrayUnion(currentUser.uid),
      });
      await updateDoc(currentRef, {
        following: arrayUnion(userId),
      });
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="text-center mb-6">
        <img
          src={profileData.profileURL || '/default-avatar.jpg'}
          alt="profile"
          className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
        />
        <h2 className="text-xl font-bold">{profileData.username || 'User'}</h2>
        <p className="text-sm text-gray-500 mb-2">{profileData.bio || ''}</p>

        <div className="flex justify-center gap-4 mb-4">
          <div className="text-center">
            <strong>{followersCount}</strong>
            <p className="text-xs text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <strong>{followingCount}</strong>
            <p className="text-xs text-gray-600">Following</p>
          </div>
        </div>

        {isOwnAccount ? (
          <button
            onClick={() => navigate('/edit-profile')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={toggleFollow}
            className={`px-4 py-2 rounded text-white ${
              isFollowing ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-3">Posts</h3>
      <div className="grid grid-cols-2 gap-2">
        {userPosts.map((post) => (
          <div key={post.id}>
            {post.type === 'image' ? (
              <img
                src={post.url}
                alt="post"
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <video
                src={post.url}
                className="w-full h-32 object-cover rounded"
                controls
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
    }
