// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Heart, Share2 } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleLike = async (post) => {
    if (!user) return alert("You must be logged in");
    const postRef = doc(db, 'posts', post.id);
    const alreadyLiked = post.likes?.includes(user.uid);
    await updateDoc(postRef, {
      likes: alreadyLiked
        ? arrayRemove(user.uid)
        : arrayUnion(user.uid)
    });
  };

  const handleComment = async (postId) => {
    const text = prompt("Enter your comment:");
    if (!text || !user) return;
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion({ userId: user.uid, text })
    });
  };

  const handleShare = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    await navigator.clipboard.writeText(url);
    alert("Post link copied to clipboard!");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Pixora</h1>
        <button onClick={() => navigate('/chat')}>
          <MessageSquare className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Feed */}
      {posts.map(post => (
        <div key={post.id} className="mb-6 border p-3 rounded">
          {post.type === 'image' ? (
            <img src={post.url} alt="post" className="w-full rounded" />
          ) : (
            <video controls src={post.url} className="w-full rounded" />
          )}
          <p className="mt-2 text-sm text-gray-700">{post.caption}</p>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-2">
            <button onClick={() => handleLike(post)}>
              <Heart
                className={`w-5 h-5 ${post.likes?.includes(user?.uid) ? 'text-red-500' : 'text-gray-500'}`}
                fill={post.likes?.includes(user?.uid) ? 'red' : 'none'}
              />
            </button>
            <button onClick={() => handleComment(post.id)}>
              <MessageSquare className="w-5 h-5 text-gray-500" />
            </button>
            <button onClick={() => handleShare(post.id)}>
              <Share2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Stats */}
          <div className="text-xs text-gray-500 mt-1">
            {post.likes?.length || 0} likes · {post.comments?.length || 0} comments
          </div>
        </div>
      ))}
    </div>
  );
          }
