// src/components/PostCard.jsx
import React, { useState } from 'react'
import { db, auth } from '../firebase'
import { doc, updateDoc } from 'firebase/firestore'

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.likes?.includes(auth.currentUser?.uid))
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(post.comments || [])

  const toggleLike = async () => {
    const ref = doc(db, 'posts', post.id)
    let updatedLikes

    if (liked) {
      updatedLikes = post.likes.filter(uid => uid !== auth.currentUser?.uid)
      setLikesCount(prev => prev - 1)
    } else {
      updatedLikes = [...(post.likes || []), auth.currentUser?.uid]
      setLikesCount(prev => prev + 1)
    }

    setLiked(!liked)
    await updateDoc(ref, { likes: updatedLikes })
  }

  const addComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const ref = doc(db, 'posts', post.id)
    const newComment = {
      uid: auth.currentUser.uid,
      username: auth.currentUser.displayName || 'anonymous',
      text: commentText
    }

    const updatedComments = [...comments, newComment]
    setComments(updatedComments)
    setCommentText('')
    await updateDoc(ref, { comments: updatedComments })
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <div className="flex items-center mb-2">
        <img src={post.userPic} className="h-10 w-10 rounded-full" />
        <p className="ml-2 font-bold">{post.username}</p>
      </div>

      <img src={post.image} className="w-full rounded-lg mb-2" />

      <p className="text-sm mb-1">{post.caption}</p>

      <div className="flex gap-4 mb-2">
        <button onClick={toggleLike}>
          {liked ? '❤️' : '🤍'} {likesCount} Likes
        </button>
      </div>

      <div className="text-sm space-y-1">
        {comments.map((c, idx) => (
          <p key={idx}>
            <strong>@{c.username}</strong>: {c.text}
          </p>
        ))}
      </div>

      <form onSubmit={addComment} className="mt-2 flex gap-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-700"
        />
        <button type="submit" className="text-blue-600 font-bold">Post</button>
      </form>
    </div>
  )
        }
