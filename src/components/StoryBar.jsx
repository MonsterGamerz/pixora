import React, { useEffect, useState } from "react"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import { useNavigate } from "react-router-dom"

function StoryBar() {
  const [stories, setStories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("timestamp", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const current = new Date()
      const validStories = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(story => {
          const createdAt = story.timestamp?.toDate?.()
          return createdAt && current - createdAt <= 86400000 // 24hr check
        })

      setStories(validStories)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="flex space-x-3 overflow-x-auto p-2 bg-black">
      {stories.map((story) => (
        <div
          key={story.id}
          onClick={() => navigate(`/story/${story.id}`)}
          className="cursor-pointer flex flex-col items-center"
        >
          <img
            src={story.imageUrl}
            alt="story"
            className="w-14 h-14 rounded-full border-2 border-pink-500 object-cover"
          />
          <p className="text-white text-xs mt-1 truncate w-14 text-center">
            {story.username || "User"}
          </p>
        </div>
      ))}
    </div>
  )
}

export default StoryBar
