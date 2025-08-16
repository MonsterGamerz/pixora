import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../firebase"
import {
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore"

export default function Profile() {
  const { username } = useParams()
  const [userData, setUserData] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1. Find user by username
        const q = query(collection(db, "users"), where("username", "==", username))
        const snap = await getDocs(q)

        if (!snap.empty) {
          const userDoc = snap.docs[0]
          setUserData({ id: userDoc.id, ...userDoc.data() })

          // 2. Fetch posts by that user’s UID
          const postsQ = query(
            collection(db, "posts"),
            where("uid", "==", userDoc.id)
          )
          const postsSnap = await getDocs(postsQ)
          setPosts(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error("Error loading profile:", err)
        setNotFound(true)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [username])

  if (loading) return <p>Loading...</p>
  if (notFound) return <p>User not found</p>

  return (
    <div className="p-4">
      {userData && (
        <>
          <h2 className="text-xl font-bold">@{userData.username}</h2>
          <p>{userData.bio || "No bio yet"}</p>

          <h3 className="mt-4 text-lg font-semibold">Posts</h3>
          {posts.length > 0 ? (
            <ul>
              {posts.map(post => (
                <li key={post.id} className="border-b py-2">
                  {post.caption || "No caption"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts yet</p>
          )}
        </>
      )}
    </div>
  )
}
