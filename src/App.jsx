import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Upload from "./pages/Upload"
import Reels from "./pages/Reels"
import Chat from "./pages/Chat"
import StoryViewer from "./pages/StoryViewer"
import { ToggleTheme } from "./components/ToggleTheme"
import AI from "./pages/AI"
import BottomNav from "./components/BottomNav"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <ToggleTheme />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/story/:id" element={<StoryViewer />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
