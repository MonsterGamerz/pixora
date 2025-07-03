// src/components/StoryBar.jsx
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

const StoryBar = ({ onSelect }) => {
  const [stories, setStories] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsub()
  }, [])

  return (
    <div className="flex overflow-x-auto p-2 gap-3">
      {stories.map(story => (
        <div key={story.id} onClick={() => onSelect(story)}>
          <img src={story.imageURL} className="w-16 h-16 rounded-full border-2 border-pink-500" />
          <p className="text-xs text-center">{story.user}</p>
        </div>
      ))}
    </div>
  )
}

export default StoryBar
