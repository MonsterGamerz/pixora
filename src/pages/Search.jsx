// src/pages/Search.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecent(stored);
  }, []);

  const handleSearch = async () => {
    const snap = await getDocs(collection(db, "users"));
    const allUsers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const filtered = allUsers.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);

    if (query.trim()) {
      const updatedRecent = [query, ...recent.filter(item => item !== query)].slice(0, 5);
      setRecent(updatedRecent);
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Users</h2>
      <input
        type="text"
        placeholder="Search by username"
        className="w-full p-2 border border-gray-300 rounded mb-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Search
      </button>

      {recent.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Recent Searches:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {recent.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <ul className="space-y-4">
          {results.map(user => (
            <li key={user.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Link to={`/profile/${user.id}`} className="text-blue-600 hover:underline font-medium">View</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
