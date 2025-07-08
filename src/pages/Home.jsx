import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Heart,
  Share2,
  Send,
} from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const id = docSnap.id;

          const likesRef = collection(db, 'posts', id, 'likes');
          const likesSnap = await onSnapshot(likesRef, () => {});
          const likes = likesSnap.size;

          const commentsRef = collection(db, 'posts', id, 'comments');
          const commentsSnap = await onSnapshot(commentsRef, () => {});
          const comments = commentsSnap.size;

          return { id, ...data, likes, comments };
        })
      );
      setPosts(postsData);
    });

    return unsubscribe;
  }, []);

  const handleLike = async (postId) => {
    const likeRef = doc(db, 'posts', postId, 'likes', auth.currentUser.uid);
    const likeSnap = await likeRef.get();

    if (likeSnap.exists()) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, {
        userId: auth.currentUser.uid,
        likedAt: new Date(),
      });
    }
  };

  const handleComment = async (postId) => {
    const comment = prompt('Write your comment:');
    if (comment) {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        userId: auth.currentUser.uid,
        text: comment,
        createdAt: new Date(),
      });
    }
  };

  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    alert('Post URL copied!');
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
          {post.type === 'image' ? (
            <img src={post.url} alt="post" className="w-full rounded" />
          ) : (
            <video controls src={post.url} className="w-full rounded" />
          )}
          <p className="mt-2 text-sm text-gray-700">{post.caption}</p>

          <div className="flex gap-4 mt-2">
            <button onClick={() => handleLike(post.id)} className="flex items-center">
              <Heart className="w-5 h-5 mr-1" /> {post.likes || 0}
            </button>
            <button onClick={() => handleComment(post.id)} className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-1" /> {post.comments || 0}
            </button>
            <button onClick={() => handleShare(post.url)} className="flex items-center">
              <Share2 className="w-5 h-5 mr-1" /> Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
