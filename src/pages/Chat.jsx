import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';

const Chat = () => {
  const { id } = useParams(); // other user's UID
  const { currentUser } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef();

  useEffect(() => {
    const q = query(
      collection(db, 'chats', getChatId(currentUser.uid, id), 'messages'),
      orderBy('createdAt')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsub();
  }, [id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, 'chats', getChatId(currentUser.uid, id), 'messages'), {
      text: input,
      senderId: currentUser.uid,
      createdAt: new Date()
    });

    setInput('');
    setIsTyping(false);
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    setIsTyping(true);

    // Add logic to update typing status in Firebase here if needed
    setTimeout(() => setIsTyping(false), 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="p-4 h-screen overflow-y-scroll bg-background">
      <div className="flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} currentUser={currentUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isTyping && <TypingIndicator />}

      <div className="fixed bottom-0 left-0 w-full p-3 bg-white flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded-xl border"
          placeholder="Type a message"
          value={input}
          onChange={handleTyping}
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded-xl">Send</button>
      </div>
    </div>
  );
};

function getChatId(uid1, uid2) {
  return uid1 < uid2 ? uid1 + '_' + uid2 : uid2 + '_' + uid1;
}

export default Chat;
