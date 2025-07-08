import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Heart, Share2 } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const toggleLike = async (postId, likes) => {
    const postRef = doc(db, 'posts', postId);
    if (likes?.includes(userId)) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
      });
    }
  };

  const handleShare = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Post URL copied to clipboard!');
    } catch (err) {
      alert('Failed to copy!');
    }
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
          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => toggleLike(post.id, post.likes)}>
              <Heart
                className={`w-5 h-5 ${post.likes?.includes(userId) ? 'text-red-500' : 'text-gray-500'}`}
                fill={post.likes?.includes(userId) ? 'red' : 'none'}
              />
            </button>

            <button onClick={() => navigate(`/post/${post.id}/comments`)}>
              <MessageSquare className="w-5 h-5 text-gray-500" />
            </button>

            <button onClick={() => handleShare(post.url)}>
              <Share2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Like Count */}
          <p className="text-sm mt-1 text-gray-600">
            {post.likes?.length || 0} likes
          </p>
        </div>
      ))}
    </div>
  );
}
