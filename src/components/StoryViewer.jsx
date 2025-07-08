import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { collection, doc, getDoc, onSnapshot, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"

function StoryViewer() {
  const { id } = useParams()
  const [story, setStory] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStory = async () => {
      const storyRef = doc(db, "stories", id)
      const storySnap = await getDoc(storyRef)

      if (storySnap.exists()) {
        const data = storySnap.data()
        const createdAt = data.timestamp?.toDate?.()
        const now = new Date()
        const diff = now - createdAt

        // 24 hours = 86,400,000 ms
        if (diff > 86400000) {
          await deleteDoc(storyRef)
          navigate("/")
        } else {
          setStory(data)

          // Auto-close after 5 seconds
          setTimeout(() => {
            navigate("/")
          }, 5000)
        }
      } else {
        navigate("/")
      }
    }

    fetchStory()
  }, [id, navigate])

  if (!story) return <div className="text-white p-4">Loading story...</div>

  return (
    <div className="h-screen w-full bg-black text-white flex items-center justify-center">
      <img
        src={story.imageUrl}
        alt="Story"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  )
}

export default StoryViewer
