import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reels from './pages/Reels';
import Upload from './pages/Upload';
import Chat from './pages/Chat';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:uid" element={<Profile />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;
