import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Account() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const uid = id || auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const fetchUser = async () => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        // Auto-create if missing
        const user = auth.currentUser;
        if (user && uid === user.uid) {
          const newUser = {
            uid,
            email: user.email,
            username: user.displayName || 'User',
            bio: '',
            followers: [],
            following: []
          };
          await setDoc(docRef, newUser);
          setUserData(newUser);
        }
      }
    };
    fetchUser();
  }, [uid]);

  if (!userData) return <div className="text-center mt-10">Loading your account...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{userData.username}'s Profile</h2>
        {uid === auth.currentUser?.uid && (
          <button
            onClick={() => navigate('/edit-profile')}
            className="text-sm text-pink-600 border px-2 py-1 rounded"
          >
            Edit
          </button>
        )}
      </div>

      <p className="text-gray-700 mb-2">Email: {userData.email}</p>
      <p className="text-gray-700 mb-2">Bio: {userData.bio || 'No bio yet'}</p>
      <p className="text-gray-700 mb-2">Followers: {userData.followers?.length || 0}</p>
      <p className="text-gray-700 mb-2">Following: {userData.following?.length || 0}</p>
    </div>
  );
}
