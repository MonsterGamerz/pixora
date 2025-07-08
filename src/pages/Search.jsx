// src/pages/Search.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => doc.data());
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  useEffect(() => {
    if (query.trim()) handleSearch();
    else setResults([]);
  }, [query]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search by username"
        className="w-full border p-2 mb-4 rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.map(user => (
        <div
          key={user.uid}
          className="p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => navigate(`/account/${user.uid}`)}
        >
          <p>@{user.username}</p>
        </div>
      ))}
    </div>
  );
}
