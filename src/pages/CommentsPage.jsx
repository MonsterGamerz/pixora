import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  doc, getDoc, addDoc, collection, query, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

const CommentPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userData, setUserData] = useState({});

  const user = auth.currentUser;

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const docSnap = await getDoc(doc(db, 'posts', postId));
      if (docSnap.exists()) setPost(docSnap.data());
    };

    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    fetchPost();
    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (user?.uid) {
      const fetchUser = async () => {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      };
      fetchUser();
    }
  }, [user]);

  const handleComment = async () => {
    if (!newComment.trim()) return;

    await addDoc(collection(db, 'posts', postId, 'comments'), {
      text: newComment.trim(),
      uid: user.uid,
      username: userData.username || 'User',
      userPic: userData.profilePic || '',
      timestamp: serverTimestamp(),
    });

    setNewComment('');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {post && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.mediaUrl.includes('video') ? (
            <video src={post.mediaUrl} controls className="w-full rounded-lg" />
          ) : (
            <img src={post.mediaUrl} alt="Post" className="w-full rounded-lg" />
          )}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
        <h2 className="text-xl font-bold mb-3 dark:text-white">Comments</h2>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Link to={`/account/${comment.uid}`}>
                <img
                  src={comment.userPic || '/default-avatar.png'}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
              <div>
                <Link to={`/account/${comment.uid}`} className="font-bold dark:text-white">
                  {comment.username}
                </Link>
                <p className="text-sm dark:text-gray-300">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleComment}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentPage;
