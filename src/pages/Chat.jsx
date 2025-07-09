// src/pages/Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';

export default function Chat() {
  const { id } = useParams(); // chatId from URL
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, 'chats', id, 'messages'),
      orderBy('timestamp')
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return unsub;
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !auth.currentUser) return;

    await addDoc(collection(db, 'chats', id, 'messages'), {
      text: input.trim(),
      senderId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <header className="p-4 font-bold text-lg border-b border-zinc-700">Chat</header>

      <div className="flex-1 p-4 overflow-y-scroll space-y-2">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.senderId === auth.currentUser?.uid
                ? 'bg-pink-600 self-end ml-auto'
                : 'bg-zinc-700 self-start mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 flex gap-2 border-t border-zinc-700">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-zinc-800 text-white"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
