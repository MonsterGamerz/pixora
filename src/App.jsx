// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Stories from './pages/Stories';
import Chat from './pages/Chat';
import Account from './pages/Account';
import EditProfile from './pages/EditProfile';
import CommentsPage from './pages/CommentsPage';
import Search from './pages/Search';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Reels from './pages/Reels';
import BottomNav from './components/BottomNav';

import { auth } from './firebase';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading your account...</div>;

  return (
    <Router>
      <div className="pb-20">
        <Routes>
          {/* Public */}
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

          {/* Protected */}
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
          <Route path="/stories" element={user ? <Stories /> : <Navigate to="/login" />} />
          <Route path="/reels" element={user ? <Reels /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
          <Route path="/account/:id?" element={user ? <Account /> : <Navigate to="/login" />} />
          <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" />} />
          <Route path="/post/:id/comments" element={user ? <CommentsPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>

        {user && <BottomNav />}
      </div>
    </Router>
  );
}
