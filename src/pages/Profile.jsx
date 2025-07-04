import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db, auth } from '../firebase'
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore'
import FollowButton from '../components/FollowButton'

export default function Profile() {
  const { uid } = useParams()
  const [userData, setUserData] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchProfile = async () => {
      // Get user data
      const ref = doc(db, 'users', uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setUserData(snap.data())
      }

      // Get user posts
      const q = query(collection(db, 'posts'), where('uid', '==', uid))
      const postsSnap = await getDocs(q)
      setPosts(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }

    fetchProfile()
  }, [uid])

  if (!userData) {
    // Display shimmer or loading message while fetching user data
    return (
      <div className="text-center mt-8">
        <div className="animate-pulse w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="w-2/3 mx-auto bg-gray-300 h-6 mb-4"></div>
        <div className="w-1/3 mx-auto bg-gray-300 h-6"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      {/* Profile Picture */}
      <div className="mb-4">
        {userData.photoURL ? (
          <img
            src={userData.photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto"></div>
        )}
      </div>

      {/* User Info */}
      <h1 className="text-2xl font-bold">{userData.username}</h1>
      <p className="text-gray-500">{userData.bio}</p>

      {/* Followers / Following */}
      <div className="flex justify-center gap-8 my-4">
        <div>
          <strong>{userData.followers?.length || 0}</strong> Followers
        </div>
        <div>
          <strong>{userData.following?.length || 0}</strong> Following
        </div>
      </div>

      {/* Follow Button */}
      {auth.currentUser?.uid !== uid && (
        <FollowButton targetId={uid} />
      )}

      {/* Edit Profile Button */}
      {auth.currentUser?.uid === uid && (
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Edit Profile
        </button>
      )}

      {/* User's Posts */}
      <h2 className="text-xl font-semibold mt-6 mb-3">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {posts.map(post => (
            <div key={post.id}>
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full aspect-square object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
