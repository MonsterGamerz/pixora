// src/pages/ChatPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useParams } from 'react-router-dom';

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef();

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
      const msgs = snap.docs.map(d => d.data());
      setMessages(msgs);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    return unsub;
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });
    setText('');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex-1 overflow-y-scroll p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs px-3 py-2 rounded-lg ${
              msg.senderId === auth.currentUser.uid ? 'bg-pink-500 self-end' : 'bg-gray-700 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex p-2 border-t border-gray-800">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 rounded-lg bg-gray-900 text-white"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 text-pink-500 font-bold">Send</button>
      </div>
    </div>
  );
}
