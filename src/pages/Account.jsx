import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

export default function Account() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const isCurrentUser = !id || id === currentUser?.uid;
  const [userData, setUserData] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const uid = id || currentUser?.uid;
    if (!uid) return;

    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };

    fetchUser();

    const q = query(collection(db, 'posts'), where('userId', '==', uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(posts);
    });

    return () => unsub();
  }, [id, currentUser]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">@{userData.username || 'User'}</h2>
          <p className="text-sm text-gray-500">{userData.bio || ''}</p>
        </div>
        {isCurrentUser && (
          <button
            onClick={() => navigate('/edit-profile')}
            className="text-blue-500 text-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      <h3 className="font-semibold mb-2">Your Posts</h3>
      {userPosts.map((post) => (
        <div key={post.id} className="mb-4 border p-2 rounded">
          {post.type === 'image' ? (
            <img src={post.url} alt="post" className="w-full rounded" />
          ) : (
            <video src={post.url} controls className="w-full rounded" />
          )}
          <p className="text-sm mt-1">{post.caption}</p>
        </div>
      ))}
    </div>
  );
}
