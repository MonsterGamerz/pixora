import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';

const EditProfile = () => {
  const [profilePic, setProfilePic] = useState('');
  const [preview, setPreview] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfilePic(data.profilePic || '');
        setUsername(data.username || '');
        setBio(data.bio || '');
      }
    };
    fetchData();
  }, [userId]);

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'pixora');
    data.append('cloud_name', 'dmwwifdds');

    const res = await fetch('https://api.cloudinary.com/v1_1/dmwwifdds/image/upload', {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  };

  const handleSave = async () => {
    setLoading(true);
    let imageUrl = profilePic;

    if (preview) {
      imageUrl = await uploadToCloudinary(preview);
    }

    await updateDoc(doc(db, 'users', userId), {
      profilePic: imageUrl,
      username,
      bio,
    });

    setLoading(false);
    alert('Profile updated!');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Edit Profile</h2>

      <div className="flex flex-col items-center">
        <img
          src={preview ? URL.createObjectURL(preview) : profilePic || '/default-avatar.png'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPreview(e.target.files[0])}
          className="mb-4"
        />
      </div>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-800 dark:text-white"
      />

      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-800 dark:text-white"
        rows={3}
      />

      <button
        onClick={handleSave}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default EditProfile;
