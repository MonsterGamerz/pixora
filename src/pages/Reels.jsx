import React, { useEffect, useState } from "react"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import ReelCard from "../components/ReelCard"

function Reels() {
  const [reels, setReels] = useState([])

  useEffect(() => {
    const q = query(collection(db, "reels"), orderBy("timestamp", "desc"))
    const unsub = onSnapshot(q, (snapshot) => {
      setReels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    return () => unsub()
  }, [])

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white">
      {reels.map((reel) => (
        <ReelCard
          key={reel.id}
          videoUrl={reel.videoUrl}
          username={reel.username}
          caption={reel.caption}
        />
      ))}
    </div>
  )
}

export default Reels
