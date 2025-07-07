// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

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
        </div>
      ))}
    </div>
  );
}
