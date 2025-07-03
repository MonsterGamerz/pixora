// src/components/StoryBar.jsx
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function StoryBar() {
  const [stories, setStories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStories = async () => {
      const snap = await getDocs(query(collection(db, 'stories'), orderBy('timestamp', 'desc')))
      const unique = []
      const seen = new Set()
      snap.docs.forEach(doc => {
        const data = doc.data()
        if (!seen.has(data.uid)) {
          seen.add(data.uid)
          unique.push({ id: doc.id, ...data })
        }
      })
      setStories(unique)
    }

    fetchStories()
  }, [])

  return (
    <div className="flex overflow-x-auto gap-4 px-2 py-2 border-b">
      {stories.map(story => (
        <div
          key={story.id}
          onClick={() => navigate(`/story/${story.uid}`)}
          className="flex flex-col items-center cursor-pointer"
        >
          <img
            src={story.userPic}
            className="h-16 w-16 rounded-full border-2 border-pink-500 object-cover"
          />
          <p className="text-xs mt-1">{story.username}</p>
        </div>
      ))}
    </div>
  )
}
