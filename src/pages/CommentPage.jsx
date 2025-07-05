// src/pages/CommentPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db, auth } from '../firebase'
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore'

export default function CommentPage() {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      const snap = await getDoc(doc(db, 'posts', postId))
      if (snap.exists()) setPost(snap.data())
    }

    const unsubscribe = onSnapshot(
      query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc')),
      (snapshot) => {
        setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      }
    )

    fetchPost()
    return () => unsubscribe()
  }, [postId])

  const handleComment = async () => {
    if (!text.trim()) return
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      text,
      uid: auth.currentUser.uid,
      username: auth.currentUser.displayName || 'User',
      userPic: auth.currentUser.photoURL || '',
      createdAt: serverTimestamp()
    })
    setText('')
  }

  if (!post) return <p className="p-4 text-center">Loading post...</p>

  return (
    <div className="max-w-xl mx-auto p-4">
      <img src={post.imageUrl} className="w-full rounded-lg mb-4" alt="Post" />
      <h2 className="text-xl font-bold mb-2">Comments</h2>

      <div className="mb-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex items-start gap-3 mb-3">
            <img
              src={comment.userPic || '/default-avatar.jpg'}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{comment.username}</p>
              <p className="text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border px-3 py-2 rounded-full"
        />
        <button onClick={handleComment} className="text-blue-500 font-bold">Post</button>
      </div>
    </div>
  )
}
