import React, { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { Link } from "react-router-dom"

function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"))
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    return () => unsub()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pixora Feed</h1>

      {/* Upload Shortcut */}
      <Link to="/upload" className="block bg-blue-600 text-white py-2 px-4 rounded mb-4 text-center">
        Upload a Post
      </Link>

      {/* Feed */}
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Be the first to upload!</p>
      ) : (
        <div className="grid gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <img src={post.imageUrl} alt="Pixora Post" className="w-full h-auto rounded mb-2" />
              <p>{post.caption}</p>
              <p className="text-xs text-gray-500">By: {post.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
