import React, { useState } from 'react'
import { storage, db, auth } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleUpload = () => {
    if (!file) return setError('Please select a file.')

    const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(prog)
      },
      (err) => setError(err.message),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        await addDoc(collection(db, 'posts'), {
          url,
          caption,
          userId: auth.currentUser.uid,
          timestamp: Timestamp.now()
        })
        navigate('/')
      }
    )
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Content</h1>
      <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files[0])} className="mb-3" />
      <textarea placeholder="Write a caption..." value={caption} onChange={e => setCaption(e.target.value)} className="w-full p-2 border rounded mb-3" />
      {progress > 0 && <p className="text-sm text-green-600 mb-2">Uploading: {Math.round(progress)}%</p>}
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
    </div>
  )
}
