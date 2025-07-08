import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.username || '');
        setBio(data.bio || '');
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!username.trim()) return alert('Username cannot be empty');
    setLoading(true);
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, { username, bio });
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
        onChange={e => setUsername(e.target.value)}
      />
      <textarea
        placeholder="Bio"
        className="w-full border p-2 mb-4 rounded"
        value={bio}
        onChange={e => setBio(e.target.value)}
      />
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
