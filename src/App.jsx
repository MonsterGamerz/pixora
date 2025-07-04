import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import StoryPage from "./pages/StoryPage";
import ReelPage from "./pages/ReelPage";
import ChatPage from "./pages/ChatPage";
import AssistantPage from "./pages/AssistantPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/stories" element={<StoryPage />} />
        <Route path="/reels" element={<ReelPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/ai" element={<AssistantPage />} />
      </Routes>
    </Router>
  );
}

export default App;
