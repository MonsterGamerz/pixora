import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const list = snapshot.docs
        .filter(doc => doc.id !== currentUid)
        .map(doc => ({ uid: doc.id, ...doc.data() }));
      setUsers(list);
    };
    fetchUsers();
  }, [currentUid]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Messages</h2>
      {users.map((user) => (
        <Link
          to={`/chat/${user.uid}`}
          key={user.uid}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <img src={user.profilePic || '/default-avatar.png'} className="w-10 h-10 rounded-full" />
          <div className="text-sm dark:text-white">
            <p className="font-medium">{user.username}</p>
            <p className="text-xs text-gray-500">{user.bio}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChatList;
