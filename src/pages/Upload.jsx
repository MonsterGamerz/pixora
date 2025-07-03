// src/pages/Upload.jsx
import React, { useState } from 'react'
import { db, storage, auth } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function Upload() {
  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!image || !caption) {
      setMessage("Please add both image and caption")
      return
    }

    setUploading(true)
    try {
      const storageRef = ref(storage, `posts/${Date.now()}-${image.name}`)
      await uploadBytes(storageRef, image)
      const downloadURL = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'posts'), {
        imageURL: downloadURL,
        caption,
        user: auth.currentUser?.email || 'Anonymous',
        createdAt: serverTimestamp()
      })

      setMessage('✅ Uploaded!')
      setImage(null)
      setCaption('')
      setPreview(null)
    } catch (err) {
      setMessage('❌ Upload failed')
    }
    setUploading(false)
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Post</h1>
      <input type="file" onChange={handleFileChange} className="mb-3" />
      {preview && <img src={preview} alt="Preview" className="mb-3 rounded" />}
      <input
        type="text"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="p-2 border w-full mb-3"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  )
}
