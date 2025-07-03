// src/pages/StoryViewer.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'

export default function StoryViewer() {
  const { uid } = useParams()
  const [media, setMedia] = useState([])
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(query(
        collection(db, 'stories'),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc')
      ))
      const data = snap.docs.map(doc => doc.data())
      setMedia(data)
    }
    fetch()
  }, [uid])

  useEffect(() => {
    if (media.length === 0) return
    const timer = setTimeout(() => {
      if (index < media.length - 1) setIndex(prev => prev + 1)
      else navigate('/')
    }, 5000) // 5 sec per story
    return () => clearTimeout(timer)
  }, [index, media, navigate])

  if (media.length === 0) return <p>Loading...</p>

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <img src={media[index].mediaUrl} className="h-full object-contain" />
    </div>
  )
}
