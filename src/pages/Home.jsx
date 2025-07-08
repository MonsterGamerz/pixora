import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Heart, Send, MessageCircle } from 'lucide-react';

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
        <div key={post.id} className="mb-6 border rounded overflow-hidden">
          {/* Media */}
          {post.type === 'image' ? (
            <img src={post.url} alt="post" className="w-full" />
          ) : (
            <video controls src={post.url} className="w-full" />
          )}

          {/* Actions */}
          <div className="flex gap-4 p-2 items-center">
            <Heart className="w-5 h-5 text-gray-700 cursor-pointer" />
            <MessageCircle
              className="w-5 h-5 text-gray-700 cursor-pointer"
              onClick={() => navigate(`/post/${post.id}`)}
            />
            <Send className="w-5 h-5 text-gray-700 cursor-pointer" />
          </div>

          {/* Caption */}
          <div className="px-2 pb-2">
            <p className="text-sm text-gray-700">{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
