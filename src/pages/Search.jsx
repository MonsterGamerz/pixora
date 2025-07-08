// src/pages/Search.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const searchUsers = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const filtered = snapshot.docs
      .map(doc => doc.data())
      .filter(user => user.username.toLowerCase().includes(query.toLowerCase()) && user.uid !== auth.currentUser.uid);
    setResults(filtered);
  };

  useEffect(() => {
    if (query.trim()) searchUsers();
    else setResults([]);
  }, [query]);

  return (
    <div className="p-4">
      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.map(user => (
        <div
          key={user.uid}
          className="flex justify-between items-center mb-3 p-2 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => navigate(`/account/${user.uid}`)}
        >
          <div>
            <p className="font-semibold">@{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <span className="text-pink-500 text-sm">View</span>
        </div>
      ))}
    </div>
  );
}
