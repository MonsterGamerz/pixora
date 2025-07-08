import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return alert("Missing file or user.");
    setUploading(true);

    try {
      // Get username
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const username = userDoc.exists() ? userDoc.data().username : 'unknown';

      // Prepare file for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'pixora'); // must match Cloudinary preset

      // Upload to Cloudinary
      console.log('Uploading to Cloudinary...');
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dmwwifdds/auto/upload',
        formData
      );
      console.log('Upload success:', res.data);

      const fileURL = res.data.secure_url;
      const type = file.type.startsWith('video') ? 'video' : 'image';

      // Upload metadata to Firestore
      await addDoc(collection(db, 'posts'), {
        url: fileURL,
        caption,
        type,
        username,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        likes: []
      });

      navigate('/');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload to Pixora</h1>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <textarea
        placeholder="Write a caption..."
        className="w-full border p-2 mb-4 rounded"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button
        onClick={handleUpload}
        className="bg-pink-500 text-white px-4 py-2 rounded w-full"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
