import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"  // Make sure this exists and renders something
import Upload from "./pages/Upload"
import StoryViewer from "./pages/StoryViewer"
import Reels from "./pages/Reels"
import BottomNav from "./components/BottomNav"
import ToggleTheme from "./components/ToggleTheme"

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">
        <ToggleTheme />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/stories" element={<StoryViewer />} />
          <Route path="/reels" element={<Reels />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
