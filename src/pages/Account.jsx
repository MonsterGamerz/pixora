import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import EditProfileModal from '../components/EditProfileModal';

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) setUserData(snap.data());
    };

    const q = query(collection(db, 'posts'), where('userId', '==', auth.currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    fetchUser();
    return unsub;
  }, []);

  return (
    <div className="p-4 text-white">
      {userData && (
        <div className="text-center">
          <img
            src={userData.profilePic || 'https://via.placeholder.com/100'}
            className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
            alt="Profile"
          />
          <h2 className="text-xl font-bold">@{userData.username}</h2>
          <p className="text-gray-400 text-sm">{userData.bio}</p>
          <div className="flex justify-center gap-4 my-4">
            <div><strong>{posts.length}</strong> posts</div>
            <div><strong>{userData.followers?.length || 0}</strong> followers</div>
            <div><strong>{userData.following?.length || 0}</strong> following</div>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="px-4 py-1 bg-pink-600 rounded text-sm"
          >
            Edit Profile
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mt-6">
        {posts.map(post => (
          post.type === 'image' ? (
            <img key={post.id} src={post.url} alt="" className="w-full h-32 object-cover" />
          ) : (
            <video key={post.id} src={post.url} className="w-full h-32 object-cover" />
          )
        ))}
      </div>

      {showEdit && (
        <EditProfileModal
          user={userData}
          onClose={() => setShowEdit(false)}
          onUpdate={() => window.location.reload()}
        />
      )}
    </div>
  );
}
