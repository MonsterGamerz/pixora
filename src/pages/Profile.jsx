// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db, auth } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import FollowButton from '../components/FollowButton'

export default function Profile() {
  const { uid } = useParams()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const ref = doc(db, 'users', uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setUserData(snap.data())
      }
    }
    getUser()
  }, [uid])

  if (!userData) return <p>Loading profile...</p>

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold">{userData.username}</h1>
      <p className="text-gray-500">{userData.bio}</p>
      <div className="flex justify-center gap-8 my-4">
        <div><strong>{userData.followers?.length || 0}</strong> Followers</div>
        <div><strong>{userData.following?.length || 0}</strong> Following</div>
      </div>

      {auth.currentUser?.uid !== uid && (
        <FollowButton targetId={uid} />
      )}

      {/* You can map posts here too */}
    </div>
  )
}
