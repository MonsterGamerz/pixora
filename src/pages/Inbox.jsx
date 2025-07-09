// src/pages/Inbox.jsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Inbox() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('users', 'array-contains', auth.currentUser.uid),
      orderBy('lastMessage.timestamp', 'desc')
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const chatsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const otherUserId = data.users.find(
            (uid) => uid !== auth.currentUser.uid
          );
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          return {
            id: docSnap.id,
            ...data,
            otherUser: userDoc.exists() ? userDoc.data() : { username: 'Unknown' },
          };
        })
      );
      setChats(chatsData);
    });

    return unsub;
  }, []);

  const openChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Inbox</h2>
      {chats.length === 0 ? (
        <p className="text-gray-400">No conversations yet.</p>
      ) : (
        <ul className="space-y-4">
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => openChat(chat.id)}
              className="bg-zinc-800 p-3 rounded-lg cursor-pointer hover:bg-zinc-700 transition"
            >
              <p className="font-semibold">@{chat.otherUser.username}</p>
              <p className="text-sm text-gray-400 truncate">
                {chat.lastMessage?.text || 'No messages yet'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
