import React, { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [commentInput, setCommentInput] = useState({})

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

  const toggleLike = async (postId, likes) => {
    const ref = doc(db, 'posts', postId)
    const uid = auth.currentUser?.uid
    if (!uid) return

    await updateDoc(ref, {
      likes: likes.includes(uid) ? arrayRemove(uid) : arrayUnion(uid)
    })
  }

  const handleComment = async (postId) => {
    const ref = doc(db, 'posts', postId)
    const uid = auth.currentUser?.uid
    const text = commentInput[postId]?.trim()
    if (!uid || !text) return

    const newComment = {
      userId: uid,
      text,
      timestamp: Date.now()
    }

    await updateDoc(ref, {
      comments: arrayUnion(newComment)
    })

    setCommentInput({ ...commentInput, [postId]: '' })
  }

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
          <p className="mb-2">{post.caption}</p>

          {/* Likes */}
          <button
            onClick={() => toggleLike(post.id, post.likes || [])}
            className="text-blue-500 mb-2"
          >
            {post.likes?.includes(auth.currentUser?.uid) ? '❤️ Liked' : '🤍 Like'} ({post.likes?.length || 0})
          </button>

          {/* Comments */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInput[post.id] || ''}
              onChange={(e) =>
                setCommentInput({ ...commentInput, [post.id]: e.target.value })
              }
              className="border px-2 py-1 rounded w-full mb-2"
            />
            <button
              onClick={() => handleComment(post.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Post
            </button>

            {/* Display comments */}
            <div className="mt-2">
              {(post.comments || []).map((c, i) => (
                <div key={i} className="text-sm border-t pt-1 mt-1">
                  <strong>{c.userId.slice(0, 6)}:</strong> {c.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
