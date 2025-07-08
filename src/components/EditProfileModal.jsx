import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [profilePic, setProfilePic] = useState(null);

  const handleSave = async () => {
    const updates = { username, bio };

    if (profilePic) {
      const fileRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
      await uploadBytes(fileRef, profilePic);
      const url = await getDownloadURL(fileRef);
      updates.profilePic = url;
    }

    await updateDoc(doc(db, 'users', auth.currentUser.uid), updates);
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-80">
        <h2 className="text-lg font-bold text-white mb-4">Edit Profile</h2>

        <input
          type="text"
          className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <textarea
          className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="text-white mb-4"
        />

        <div className="flex justify-between">
          <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
          <button onClick={handleSave} className="bg-pink-600 px-4 py-1 rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
