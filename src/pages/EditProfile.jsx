import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || '');
        setBio(data.bio || '');
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !username.trim()) return alert("Username required");

    setLoading(true);
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
      username,
      bio,
    });

    setLoading(false);
    navigate(`/account`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 mb-4 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <textarea
        placeholder="Bio"
        className="w-full border p-2 mb-4 rounded"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
