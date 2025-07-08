import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Reels from './pages/Reels';
import Stories from './pages/Stories';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Search from './pages/Search';
import CommentsPage from './pages/CommentsPage';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/search" element={<Search />} />
          <Route path="/post/:id/comments" element={<CommentsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
