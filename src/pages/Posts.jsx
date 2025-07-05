import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore'

export default function Posts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, async (snapshot) => {
      const postList = []
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data()
        let userData = null
        try {
          const userDoc = await getDoc(doc(db, 'users', data.userId))
          userData = userDoc.exists() ? userDoc.data() : null
        } catch (err) {
          console.error(err)
        }

        postList.push({
          id: docSnap.id,
          ...data,
          username: userData?.username || 'Unknown User'
        })
      }
      setPosts(postList)
    })

    return () => unsub()
  }, [])

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Latest Posts</h1>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map(post => (
        <div key={post.id} className="mb-6 border rounded p-3 bg-white shadow-sm">
          <p className="font-semibold mb-2">@{post.username}</p>
          {post.url.includes('video') ? (
            <video src={post.url} controls className="w-full rounded mb-2" />
          ) : (
            <img src={post.url} alt="uploaded" className="w-full rounded mb-2" />
          )}
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  )
}
