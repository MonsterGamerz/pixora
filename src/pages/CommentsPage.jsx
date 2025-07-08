// src/pages/CommentsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  query,
  orderBy,
  addDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function CommentsPage() {
  const { id } = useParams(); // postId
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const q = query(collection(db, `posts/${id}/comments`), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [id]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !auth.currentUser) return;
    await addDoc(collection(db, `posts/${id}/comments`), {
      text: newComment,
      userId: auth.currentUser.uid,
      username: auth.currentUser.displayName || "Anonymous",
      createdAt: serverTimestamp()
    });
    setNewComment('');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Comments</h1>

      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="border p-2 rounded">
            <p className="font-semibold">@{comment.username}</p>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          className="flex-1 border p-2 rounded-l"
          placeholder="Write a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button
          className="bg-pink-500 text-white px-4 rounded-r"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
}
