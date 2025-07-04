// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Reels from './pages/Reels';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile/:uid" element={<Profile />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;
