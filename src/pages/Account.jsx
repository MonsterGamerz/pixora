// src/pages/Account.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase'

export default function Account() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const load = async () => {
      const userRef = doc(db, 'users', id)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        setUser(userSnap.data())
      }

      const q = query(collection(db, 'posts'), where('userId', '==', id))
      const snap = await getDocs(q)
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }

    load()
  }, [id])

  if (!user) return <p className="text-white p-4">Loading user...</p>

  return (
    <div className="text-white p-4">
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePic || 'https://placehold.co/100x100'}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">@{user.username}</h2>
          <p className="text-sm text-gray-400">{user.bio || 'No bio'}</p>
          {auth.currentUser?.uid === id && (
            <Link
              to="/edit-profile"
              className="text-pink-400 hover:underline text-sm mt-2 block"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Posts</h3>
        <div className="grid grid-cols-2 gap-2">
          {posts.map(p =>
            p.type === 'image' ? (
              <img key={p.id} src={p.url} alt="" className="w-full h-40 object-cover rounded" />
            ) : (
              <video key={p.id} src={p.url} className="w-full h-40 object-cover rounded" muted />
            )
          )}
        </div>
      </div>
    </div>
  )
}
