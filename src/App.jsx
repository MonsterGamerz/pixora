import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Stories from './pages/Stories';
import Chat from './pages/Chat';
import Account from './pages/Account';
import EditProfile from './pages/EditProfile';
import CommentsPage from './pages/CommentsPage';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/account/:id?" element={<Account />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/post/:id/comments" element={<CommentsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
