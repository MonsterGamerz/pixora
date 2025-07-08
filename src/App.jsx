import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Reels from './pages/Reels';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import EditProfile from './pages/EditProfile';
import CommentsPage from './pages/CommentsPage';
import Search from './pages/Search';
import BottomNav from './components/BottomNav';

export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUser({ ...user, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading your account...
      </div>
    );
  }

  // Show only Login/Signup if not authenticated
  if (!user && location.pathname !== '/login' && location.pathname !== '/signup') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/search" element={<Search />} />
        <Route path="/account" element={<Account />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/post/:postId/comments" element={<CommentsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {/* Hide BottomNav on Login/Signup/StoryViewer */}
      {!['/login', '/signup'].includes(location.pathname) &&
        !location.pathname.startsWith('/stories/') && <BottomNav />}
    </div>
  );
}
