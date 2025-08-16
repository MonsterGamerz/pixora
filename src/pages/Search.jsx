// src/pages/Search.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const users = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
      }));

      // Add fallbacks
      const cleanedUsers = users.map(user => ({
        ...user,
        username: user.username || user.displayName || user.email?.split('@')[0] || "Unknown User",
        profilePic: user.profilePic || '/default-avatar.png',
      }));

      setAllUsers(cleanedUsers);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    const results = allUsers.filter(user =>
      user.username?.toLowerCase().includes(s)
    );
    setFilteredUsers(results);
  }, [search, allUsers]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">
        Search Users
      </h2>

      <input
        type="text"
        placeholder="Search by username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded-xl dark:bg-gray-800 dark:text-white"
      />

      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <Link
            to={`/account/${user.uid}`}  // ✅ matches Profile.jsx (uses uid)
            key={user.uid}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold dark:text-white">{user.username}</p>
              {user.bio && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {user.bio}
                </p>
              )}
            </div>
          </Link>
        ))}

        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
