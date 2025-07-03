// src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import PostCard from '../components/PostCard'
import StoryBar from '../components/StoryBar'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const snap = await getDocs(collection(db, 'posts'))
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPosts(data)
    }
    fetchPosts()
  }, [])

  return (
    <div className="max-w-xl mx-auto py-4 px-2">
      <StoryBar />
      <div className="space-y-4 mt-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
