import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Reels from './pages/Reels';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import StoryUpload from './pages/StoryUpload';
import CommentsPage from './pages/CommentsPage';
import EditProfile from './pages/EditProfile';
import Account from './pages/Account';
import Search from './pages/Search';
import Pro from './pages/Pro';
import Success from './pages/Success';
import Inbox from './pages/Inbox';
import AI from './pages/AI';

import Login from './pages/Login';
import Signup from './pages/Signup';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

import BottomNav from './components/BottomNav';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="pb-16"> {/* Bottom padding for BottomNav */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/reels" element={<ProtectedRoute><Reels /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/story-upload" element={<ProtectedRoute><StoryUpload /></ProtectedRoute>} />
            <Route path="/comments/:postId" element={<ProtectedRoute><CommentsPage /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/pro" element={<ProtectedRoute><Pro /></ProtectedRoute>} />
            <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
          </Routes>
        </div>

        <BottomNav />
      </Router>
    </AuthProvider>
  );
}

export default App;
