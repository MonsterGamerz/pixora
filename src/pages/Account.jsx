// src/pages/Accounts.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const dummyUsers = [
  { uid: 'user1', username: 'LionelMessi', bio: 'GOAT of Football' },
  { uid: 'user2', username: 'PixoraFan', bio: 'Sharing my world 🌀' },
  { uid: 'user3', username: 'JaneDoe', bio: 'Photographer & Dreamer' },
]

export default function Accounts() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="space-y-4">
        {dummyUsers.map(user => (
          <Link to={`/profile/${user.uid}`} key={user.uid} className="block p-4 border border-gray-200 rounded-xl shadow hover:bg-gray-50 transition">
            <h2 className="text-lg font-semibold">{user.username}</h2>
            <p className="text-gray-500">{user.bio}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
