import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'posts', postId), (docSnap) => {
      const data = docSnap.data();
      setLikes(data?.likes || []);
      setLiked(data?.likes?.includes(auth.currentUser?.uid));
    });
    return () => unsub();
  }, [postId]);

  const toggleLike = async () => {
    const postRef = doc(db, 'posts', postId);
    if (liked) {
      await updateDoc(postRef, {
        likes: arrayRemove(auth.currentUser.uid)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(auth.currentUser.uid)
      });
    }
  };

  return (
    <button onClick={toggleLike} className="text-red-500">
      {liked ? '♥' : '♡'} {likes.length}
    </button>
  );
}
