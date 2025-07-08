// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Pages
import Home from './pages/Home';
import Upload from './pages/Upload';
import Stories from './pages/Stories';
import Chat from './pages/Chat';
import Account from './pages/Account';
import EditProfile from './pages/EditProfile';
import CommentsPage from './pages/CommentsPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Components
import BottomNav from './components/BottomNav';

function AppRoutes({ isAuthenticated }) {
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/account/:id?" element={<Account />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/post/:id/comments" element={<CommentsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {/* Show BottomNav only if authenticated */}
      {isAuthenticated && <BottomNav />}
    </>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="pb-16">
        <AppRoutes isAuthenticated={isAuthenticated} />
      </div>
    </Router>
  );
}
