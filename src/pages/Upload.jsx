import React, { useState } from "react"
import { storage, db } from "../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

function Upload() {
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState("")
  const [username, setUsername] = useState("")
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file || !caption || !username) {
      alert("Please fill in all fields.")
      return
    }

    try {
      setUploading(true)
      const storageRef = ref(storage, `posts/${Date.now()}-${file.name}`)
      await uploadBytes(storageRef, file)
      const imageUrl = await getDownloadURL(storageRef)

      await addDoc(collection(db, "posts"), {
        imageUrl,
        caption,
        username,
        timestamp: serverTimestamp(),
      })

      setUploading(false)
      alert("Post uploaded!")
      navigate("/")
    } catch (err) {
      console.error(err)
      alert("Upload failed.")
      setUploading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Upload to Pixora</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2 block"
      />

      <input
        type="text"
        placeholder="Your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 block border px-2 py-1 w-full"
      />

      <textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="mb-2 block border px-2 py-1 w-full"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  )
}

export default Upload
