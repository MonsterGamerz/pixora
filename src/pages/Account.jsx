import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Account() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(userPosts);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="text-center mb-6">
        <img
          src={user.photoURL || 'https://via.placeholder.com/100'}
          alt="profile"
          className="w-24 h-24 rounded-full mx-auto mb-2"
        />
        <h2 className="text-xl font-bold">{user.displayName || 'Unnamed User'}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <button
          onClick={() => navigate('/edit-profile')}
          className="mt-3 bg-pink-500 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-3">Your Posts</h3>
      <div className="grid grid-cols-2 gap-2">
        {posts.map(post => (
          <div key={post.id}>
            {post.type === 'image' ? (
              <img src={post.url} alt="post" className="w-full h-32 object-cover rounded" />
            ) : (
              <video src={post.url} className="w-full h-32 object-cover rounded" controls />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
