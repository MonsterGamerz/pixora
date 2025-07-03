import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function StoryViewer() {
  const { uid } = useParams()
  const [media, setMedia] = useState([])
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStories = async () => {
      const now = new Date()
      const snap = await getDocs(query(
        collection(db, 'stories'),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc')
      ))
      const valid = snap.docs
        .map(docSnap => docSnap.data())
        .filter(data => {
          const created = data.timestamp?.toDate()
          const hoursSince = (now - created) / (1000 * 60 * 60)
          return hoursSince <= 24
        })
      setMedia(valid)
    }
    fetchStories()
  }, [uid])

  // advance every 5 seconds, or exit when done
  useEffect(() => {
    if (media.length === 0) return
    const timer = setTimeout(() => {
      if (index < media.length - 1) {
        setIndex(i => i + 1)
      } else {
        navigate('/')
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [index, media, navigate])

  if (media.length === 0) {
    return <div className="p-4 text-center">No stories to show.</div>
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <img
        src={media[index].mediaUrl}
        alt="story media"
        className="max-h-[90vh] object-contain"
      />
    </div>
  )
}
