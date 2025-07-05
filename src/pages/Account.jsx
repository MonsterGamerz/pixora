// src/pages/Accounts.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Accounts() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const snap = await getDocs(collection(db, "users"));
      const allUsers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(allUsers);
    };

    fetchAccounts();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user.id} className="flex items-center justify-between bg-white p-4 shadow rounded">
            <div>
              <h3 className="font-semibold">{user.username}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Link to={`/profile/${user.id}`} className="text-blue-600 font-medium hover:underline">View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
