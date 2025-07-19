import React, { useEffect, useRef, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection, addDoc, serverTimestamp, query, orderBy, onSnapshot
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const ChatRoom = () => {
  const { uid: receiverId } = useParams();
  const senderId = auth.currentUser.uid;
  const chatId = [senderId, receiverId].sort().join('_');

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId,
      timestamp: serverTimestamp(),
    });

    setText('');
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900" ref={chatRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] mb-2 p-2 rounded-xl ${
              msg.senderId === senderId
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-3 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
        <input
          type="text"
          value={text}
          placeholder="Type a message"
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded-xl border dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
