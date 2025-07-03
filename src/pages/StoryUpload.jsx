// src/pages/StoryUpload.jsx
import React, { useState } from 'react'
import { auth, db, storage } from '../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuid } from 'uuid'
import { useNavigate } from 'react-router-dom'

export default function StoryUpload() {
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) return

    const storageRef = ref(storage, `stories/${uuid()}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)

    await addDoc(collection(db, 'stories'), {
      uid: auth.currentUser.uid,
      username: auth.currentUser.displayName || 'user',
      userPic: auth.currentUser.photoURL || '',
      mediaUrl: url,
      timestamp: serverTimestamp()
    })

    navigate('/')
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Story</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
    </div>
  )
}
