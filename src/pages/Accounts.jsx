// src/pages/Accounts.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Accounts</h1>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <strong>{user.username}</strong>
              <p className="text-sm text-gray-600">{user.bio || 'No bio available'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
