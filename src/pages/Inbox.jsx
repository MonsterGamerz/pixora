// src/pages/Inbox.jsx
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Inbox() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const meId = auth.currentUser?.uid;
      const snap = await getDoc(doc(db, 'users', meId));
      const data = snap.data();
      const chatIds = data?.chats || [];
      setChats(chatIds);
    };
    fetchChats();
  }, []);

  const getOtherUserId = (chatId) => {
    const ids = chatId.split('_');
    return ids.find(id => id !== auth.currentUser.uid);
  };

  const goToChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="p-4 text-white bg-black h-screen">
      <h1 className="text-xl font-bold mb-4">Inbox</h1>
      <ul className="space-y-2">
        {chats.map(chatId => {
          const otherId = getOtherUserId(chatId);
          return (
            <li
              key={chatId}
              onClick={() => goToChat(chatId)}
              className="bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700"
            >
              Chat with: <span className="font-bold">{otherId}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
