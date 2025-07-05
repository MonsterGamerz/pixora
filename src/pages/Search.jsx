// src/pages/Search.jsx
import React, { useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const navigate = useNavigate()

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setRecentSearches((prev) => [searchTerm, ...prev.filter(term => term !== searchTerm)].slice(0, 5))

    const q = query(
      collection(db, 'users'),
      where('username', '>=', searchTerm),
      where('username', '<=', searchTerm + '\uf8ff')
    )

    const snapshot = await getDocs(q)
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setResults(users)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span
          className="absolute left-3 top-3 text-gray-400 cursor-pointer"
          onClick={handleSearch}
        >🔍</span>
      </div>

      {recentSearches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-gray-500 mb-2">Recent Searches</h3>
          <ul className="space-y-2">
            {recentSearches.map((item, idx) => (
              <li key={idx} className="text-blue-500 cursor-pointer" onClick={() => {
                setSearchTerm(item)
                handleSearch()
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Results:</h3>
          {results.map((user) => (
            <div
              key={user.id}
              className="p-3 border rounded-lg mb-3 cursor-pointer hover:bg-gray-50 flex items-center gap-4"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <img
                src={user.photoURL || '/default-profile.jpg'}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-500">{user.bio || 'No bio'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
