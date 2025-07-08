// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Upload from './pages/Upload.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Account from './pages/Account.jsx';
import Accounts from './pages/Accounts.jsx';
import Reels from './pages/Reels.jsx';
import Posts from './pages/Posts.jsx';
import Stories from './pages/Stories.jsx';
import StoryUpload from './pages/StoryUpload.jsx';
import Chat from './pages/Chat.jsx';
import Search from './pages/Search.jsx';
import Pro from './pages/Pro.jsx';
import CommentsPage from './pages/CommentsPage.jsx';
import StoryViewer from './components/StoryViewer.jsx';
import Comments from './components/Comments.jsx';
import BottomNav from './components/BottomNav.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

export default function App() {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/account/:id" element={<Account />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/story-upload" element={<StoryUpload />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/search" element={<Search />} />
          <Route path="/pro" element={<Pro />} />
          <Route path="/post/:id/comments" element={<CommentsPage />} />
          <Route path="/viewer/:id" element={<StoryViewer />} />
          <Route path="/comments-test" element={<Comments />} />
        </Routes>

        {/* Persistent Bottom Navigation */}
        <BottomNav />
      </div>
    </Router>
  );
}
