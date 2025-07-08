import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload'; // you’ll make this next

export default function EditProfile() {
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBio(data.bio || '');
        setImage(data.profilePic || '');
      }
    };
    fetch();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalUrl = image;
    if (image && image.startsWith('data:')) {
      finalUrl = await uploadImageToCloudinary(image);
    }

    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      bio,
      profilePic: finalUrl
    });

    setLoading(false);
    navigate(`/account/${auth.currentUser.uid}`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <label className="text-white">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            if (file) reader.readAsDataURL(file);
          }}
          className="w-full p-2 bg-gray-800 text-white"
        />
        {image && (
          <img src={image} alt="preview" className="w-20 h-20 rounded-full object-cover" />
        )}

        <label className="text-white">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full py-2 rounded bg-pink-600 text-white font-semibold"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
