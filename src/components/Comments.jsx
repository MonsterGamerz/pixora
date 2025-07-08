import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'posts', postId), (docSnap) => {
      setComments(docSnap.data()?.comments || []);
    });
    return () => unsub();
  }, [postId]);

  const submitComment = async () => {
    if (!text.trim()) return;
    const comment = {
      uid: auth.currentUser.uid,
      text,
      createdAt: new Date()
    };
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: [...comments, comment]
    });
    setText('');
  };

  return (
    <div>
      <div className="mb-2">
        {comments.map((c, i) => (
          <p key={i} className="text-sm border-b py-1"><b>{c.uid}</b>: {c.text}</p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-1 text-sm"
          placeholder="Add a comment..."
        />
        <button onClick={submitComment} className="text-blue-500 text-sm">Post</button>
      </div>
    </div>
  );
}
