// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Pages
import Home from './pages/Home';
import Upload from './pages/Upload';
import Reels from './pages/Reels';
import Stories from './pages/Stories';
import StoryUpload from './pages/StoryUpload';
import Chat from './pages/Chat';
import ChatPage from './pages/ChatPage';
import Inbox from './pages/Inbox';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Search from './pages/Search';
import CommentsPage from './pages/CommentsPage';
import Pro from './pages/Pro';
import Success from './pages/Success';
import AI from './pages/AI';

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/story/upload" element={<StoryUpload />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/account/:id" element={<Account />} />
            <Route path="/search" element={<Search />} />
            <Route path="/post/:postId/comments" element={<CommentsPage />} />
            <Route path="/pro" element={<Pro />} />
            <Route path="/success" element={<Success />} />
            <Route path="/ai" element={<AI />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
