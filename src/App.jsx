import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Chat from "./pages/Chat";
import Reels from "./pages/Reels";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import StoryBar from "./components/StoryBar";
import Assistant from "./pages/Assistant"; // Your AI assistant page

function App() {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen">
        <Navbar />
        <StoryBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai" element={<AI />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
