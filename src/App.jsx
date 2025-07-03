import { db, storage, auth } from './firebase'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Upload from './pages/Upload'
import StoryUpload from './pages/StoryUpload'
import StoryViewer from './pages/StoryViewer'
import ToggleTheme from './components/ToggleTheme'
import BottomNav from './components/BottomNav'
import { ThemeProvider } from './ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <Router>
          <ToggleTheme />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload-story" element={<StoryUpload />} />
            <Route path="/story/:uid" element={<StoryViewer />} />
            {/* Add more routes here like /chat /reels /profile */}
          </Routes>
          <BottomNav />
        </Router>
      </div>
    </ThemeProvider>
  )
}
