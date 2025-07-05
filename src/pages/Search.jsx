// src/pages/Search.jsx import React, { useState, useEffect } from 'react' import { collection, getDocs } from 'firebase/firestore' import { db } from '../firebase' import { Link } from 'react-router-dom'

export default function Search() { const [search, setSearch] = useState('') const [results, setResults] = useState([]) const [recent, setRecent] = useState([])

useEffect(() => { const stored = localStorage.getItem('recentSearches') if (stored) setRecent(JSON.parse(stored)) }, [])

useEffect(() => { const fetchUsers = async () => { const querySnapshot = await getDocs(collection(db, 'users')) const users = [] querySnapshot.forEach((doc) => { users.push({ id: doc.id, ...doc.data() }) }) setResults(users) } fetchUsers() }, [])

const handleSearch = (val) => { setSearch(val) if (val && !recent.includes(val)) { const updated = [val, ...recent.slice(0, 4)] setRecent(updated) localStorage.setItem('recentSearches', JSON.stringify(updated)) } }

const filtered = results.filter(user => user.username?.toLowerCase().includes(search.toLowerCase()) )

return ( <div className="p-4 max-w-lg mx-auto"> <input type="text" placeholder="Search users..." className="w-full p-2 border rounded" value={search} onChange={(e) => handleSearch(e.target.value)} />

{recent.length > 0 && (
    <div className="mt-4">
      <h2 className="text-sm text-gray-500 mb-1">Recent Searches</h2>
      <div className="flex gap-2 flex-wrap">
        {recent.map((r, i) => (
          <button
            key={i}
            className="text-sm bg-gray-200 rounded px-2 py-1"
            onClick={() => handleSearch(r)}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )}

  <div className="mt-6 space-y-3">
    {filtered.length === 0 && <p className="text-gray-500">No users found</p>}
    {filtered.map((user) => (
      <Link
        key={user.id}
        to={`/profile/${user.id}`}
        className="flex items-center gap-4 border p-2 rounded hover:bg-gray-100"
      >
        <img
          src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">@{user.username}</p>
          <p className="text-xs text-gray-500">{user.bio}</p>
        </div>
      </Link>
    ))}
  </div>
</div>

) }

