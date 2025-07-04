// src/components/ChatList.jsx
import React, { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'

const ChatList = ({ onSelect }) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'users'))
    const unsub = onSnapshot(q, (snap) => {
      const otherUsers = snap.docs
        .map(doc => doc.data())
        .filter(user => user.email !== auth.currentUser?.email)
      setUsers(otherUsers)
    })

    return () => unsub()
  }, [])

  return (
    <div className="w-1/4 border-r overflow-y-auto p-2">
      <h2 className="text-xl font-bold mb-2">Chats</h2>
      {users.map(user => (
        <div
          key={user.email}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(user.email)}
        >
          {user.email}
        </div>
      ))}
    </div>
  )
}

export default ChatList
