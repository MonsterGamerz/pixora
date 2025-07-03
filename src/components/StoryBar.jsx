import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function StoryBar() {
  const [stories, setStories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStories = async () => {
      const now = new Date()
      const snap = await getDocs(query(collection(db, 'stories'), orderBy('timestamp', 'desc')))
      const unique = []
      const seen = new Set()

      snap.docs.forEach(docSnap => {
        const data = docSnap.data()
        const storyTime = data.timestamp?.toDate()
        // compute hours since posted
        const hoursSince = (now - storyTime) / (1000 * 60 * 60)
        if (hoursSince <= 24 && !seen.has(data.uid)) {
          seen.add(data.uid)
          unique.push({ id: docSnap.id, ...data })
        }
      })

      setStories(unique)
    }

    fetchStories()
  }, [])

  return (
    <div className="flex overflow-x-auto gap-4 px-2 py-2 border-b no-scrollbar">
      {stories.map(story => (
        <div
          key={story.id}
          onClick={() => navigate(`/story/${story.uid}`)}
          className="flex flex-col items-center cursor-pointer"
        >
          <img
            src={story.userPic}
            alt={`${story.username}’s story`}
            className="h-16 w-16 rounded-full border-2 border-pink-500 object-cover"
          />
          <p className="text-xs mt-1">{story.username}</p>
        </div>
      ))}
    </div>
  )
}
