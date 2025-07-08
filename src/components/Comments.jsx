import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { db, auth } from '../firebase';

export default function Comments() {
  const { id: postId } = useParams();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const userSnap = await getDoc(doc(db, 'users', data.userId));
          const userData = userSnap.exists() ? userSnap.data() : {};
          return {
            id: docSnap.id,
            ...data,
            username: userData.username || 'unknown',
          };
        })
      );
      setComments(data);
    });

    return () => unsub();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'comments'), {
      postId,
      text,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    setText('');
  };

  const handleDelete = async (commentId) => {
    await deleteDoc(doc(db, 'comments', commentId));
  };

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen bg-black text-white">
      <h2 className="text-xl font-bold mb-4 text-center">Comments</h2>

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-pink-600 px-4 rounded hover:bg-pink-700 transition"
        >
          Post
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-800 p-3 rounded mb-2">
            <div className="flex items-center justify-between mb-1">
              <Link
                to={`/account/${c.userId}`}
                className="text-sm font-semibold text-pink-400 hover:underline"
              >
                @{c.username}
              </Link>

              {auth.currentUser?.uid === c.userId && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500 text-xs"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-sm text-white">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
