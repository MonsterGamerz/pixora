// src/components/FollowButton.jsx
import React, { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default function FollowButton({ targetId }) {
  const currentId = auth.currentUser?.uid
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const check = async () => {
      const docSnap = await getDoc(doc(db, 'users', currentId))
      const data = docSnap.data()
      setIsFollowing(data.following?.includes(targetId))
    }
    check()
  }, [targetId])

  const toggleFollow = async () => {
    const userRef = doc(db, 'users', currentId)
    const targetRef = doc(db, 'users', targetId)

    const userSnap = await getDoc(userRef)
    const targetSnap = await getDoc(targetRef)

    const user = userSnap.data()
    const target = targetSnap.data()

    if (isFollowing) {
      await updateDoc(userRef, {
        following: user.following.filter(uid => uid !== targetId),
      })
      await updateDoc(targetRef, {
        followers: target.followers.filter(uid => uid !== currentId),
      })
    } else {
      await updateDoc(userRef, {
        following: [...(user.following || []), targetId],
      })
      await updateDoc(targetRef, {
        followers: [...(target.followers || []), currentId],
      })
    }

    setIsFollowing(!isFollowing)
  }

  return (
    <button
      onClick={toggleFollow}
      className={`px-4 py-2 rounded ${
        isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
      }`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  )
}
