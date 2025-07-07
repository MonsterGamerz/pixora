// src/pages/Upload.jsx
import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage, db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;
    setUploading(true);

    const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, 'posts'), {
      url: fileURL,
      caption,
      type: file.type.startsWith('video') ? 'video' : 'image',
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });

    setUploading(false);
    navigate('/');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload to Pixora</h1>
      <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
      <textarea
        placeholder="Write a caption..."
        className="w-full border p-2 mb-4"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button
        onClick={handleUpload}
        className="bg-pink-500 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
