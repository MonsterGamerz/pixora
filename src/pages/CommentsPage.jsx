import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import moment from 'moment';

export default function CommentsPage() {
  const { id } = useParams(); // post ID
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'posts', id, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, async (snapshot) => {
      const commentData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const userSnap = await getDoc(doc(db, 'users', data.userId));
          const userData = userSnap.exists() ? userSnap.data() : {};
          return {
            id: docSnap.id,
            ...data,
            username: userData.username || 'Unknown',
            photoURL: userData.photoURL || '',
          };
        })
      );
      setComments(commentData);
    });

    return unsub;
  }, [id]);

  const handleComment = async () => {
    const userId = auth.currentUser?.uid;
    if (!text.trim() || !userId) return;

    await addDoc(collection(db, 'posts', id, 'comments'), {
      text,
      userId,
      createdAt: serverTimestamp(),
    });

    setText('');
  };

  const handleDelete = async (commentId) => {
    await deleteDoc(doc(db, 'posts', id, 'comments', commentId));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Comments</h1>

      {/* Comments List */}
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2 mb-3">
          <img
            src={comment.photoURL || '/default-avatar.png'}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 bg-gray-100 p-2 rounded">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold">@{comment.username}</p>
              {comment.createdAt?.seconds && (
                <span className="text-xs text-gray-500">
                  {moment(comment.createdAt.toDate()).fromNow()}
                </span>
              )}
            </div>
            <p className="text-sm">{comment.text}</p>
            {auth.currentUser?.uid === comment.userId && (
              <button
                className="text-red-500 text-xs mt-1"
                onClick={() => handleDelete(comment.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Comment Box */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleComment}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
}
