// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Heart, Share } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, async (snapshot) => {
      const postList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postList);

      const userIds = [...new Set(postList.map(post => post.userId))];
      const nameMap = {};
      await Promise.all(
        userIds.map(async (uid) => {
          const userDoc = await getDoc(doc(db, 'users', uid));
          nameMap[uid] = userDoc.exists() ? userDoc.data().username : 'Unknown';
        })
      );
      setUsernames(nameMap);
    });
    return unsub;
  }, []);

  const toggleLike = async (postId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const postRef = doc(db, 'posts', postId);
    const isLiked = likes[postId]?.includes(userId);

    await updateDoc(postRef, {
      likes: isLiked ? arrayRemove(userId) : arrayUnion(userId),
    });
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const likeData = {};
      snapshot.forEach((doc) => {
        likeData[doc.id] = doc.data().likes || [];
      });
      setLikes(likeData);
    });
    return unsub;
  }, []);

  const handleShare = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Pixora</h1>
        <button onClick={() => navigate('/chat')}>
          <MessageSquare className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="mb-6 border p-3 rounded">
          <p className="text-sm font-semibold text-gray-700">
            @{usernames[post.userId] || 'Loading...'}
          </p>
          {post.type === 'image' ? (
            <img src={post.url} alt="post" className="w-full rounded mt-1" />
          ) : (
            <video controls src={post.url} className="w-full rounded mt-1" />
          )}
          <p className="mt-2 text-sm text-gray-700">{post.caption}</p>
          <div className="flex items-center gap-4 mt-2 text-gray-700">
            <button onClick={() => toggleLike(post.id)}>
              <Heart
                className={`w-5 h-5 ${
                  likes[post.id]?.includes(auth.currentUser?.uid) ? 'text-red-500' : ''
                }`}
              />
            </button>
            <button onClick={() => navigate(`/post/${post.id}/comments`)}>
              <MessageSquare className="w-5 h-5" />
            </button>
            <button onClick={() => handleShare(post.url)}>
              <Share className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {likes[post.id]?.length || 0} likes
          </p>
        </div>
      ))}
    </div>
  );
}
