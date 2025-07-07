import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Home from './pages/Home';
import Reels from './pages/Reels';
import Upload from './pages/Upload';
import Search from './pages/Search';
import Accounts from './pages/Accounts';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BottomNav from './components/BottomNav';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) return <LoadingScreen />;

  return (
    <Router>
      <div className="pb-16"> {/* Bottom nav padding */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          {user ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/search" element={<Search />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/profile/:uid" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
            </>
          ) : (
            // Redirect to login if not authenticated
            <>
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
        {user && <BottomNav />}
      </div>
    </Router>
  );
}
