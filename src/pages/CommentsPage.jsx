// src/pages/CommentsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function CommentsPage() {
  const { id: postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Subscribe to comments subcollection
  useEffect(() => {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snapshot => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      userId: auth.currentUser.uid,
      text: newComment.trim(),
      createdAt: serverTimestamp()
    });
    setNewComment('');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Comments</h1>
      <div className="space-y-3 mb-6">
        {comments.map(c => (
          <div key={c.id} className="border-b pb-2">
            <p className="text-sm">{c.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Write a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
}
