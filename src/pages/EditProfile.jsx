// src/pages/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProfile() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [profileURL, setProfileURL] = useState('');
  const navigate = useNavigate();

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || '');
        setBio(data.bio || '');
        setProfileURL(data.profileURL || '');
      }
    };
    fetchData();
  }, [userId]);

  const handleSave = async () => {
    let uploadedImage = profileURL;

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'pixora');

      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dmwwifdds/image/upload',
        formData
      );
      uploadedImage = res.data.secure_url;
    }

    await setDoc(doc(db, 'users', userId), {
      username,
      bio,
      profileURL: uploadedImage,
    });

    navigate('/account');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>

      {profileURL && (
        <img src={profileURL} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border rounded mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <textarea
        placeholder="Bio"
        className="w-full p-2 border rounded mb-4"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Save
      </button>
    </div>
  );
        }
