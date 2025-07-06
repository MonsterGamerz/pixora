// src/pages/Search.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';

export default function Search() {
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedSearches);
  }, []);

  const handleSearch = async () => {
    if (!queryText) return;
    const q = query(collection(db, 'users'), where('username', '>=', queryText), where('username', '<=', queryText + '\uf8ff'));
    const snapshot = await getDocs(q);
    const matchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setResults(matchedUsers);

    const updatedSearches = [queryText, ...recentSearches.filter((item) => item !== queryText)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        className="w-full p-2 rounded border"
        placeholder="Search by username..."
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />

      <div className="mt-4">
        <h2 className="font-bold text-lg mb-2">Recent Searches</h2>
        {recentSearches.length === 0 && <p className="text-gray-500">No recent searches</p>}
        <ul className="space-y-1">
          {recentSearches.map((search, idx) => (
            <li
              key={idx}
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setQueryText(search);
                handleSearch();
              }}
            >
              {search}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="font-bold text-lg mb-2">Results</h2>
        {results.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          <ul className="space-y-2">
            {results.map((user) => (
              <li
                key={user.id}
                className="border p-3 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <strong>{user.username}</strong><br />
                <small className="text-gray-500">{user.bio || 'No bio'}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
                  }
