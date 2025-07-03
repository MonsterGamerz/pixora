import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import Pages
import Home from './pages/Home'
import Upload from './pages/Upload'
import Reels from './pages/Reels'
import Stories from './pages/Stories'
import Chat from './pages/Chat'
import Assistant from './pages/Assistant'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import StoryUpload from './pages/StoryUpload'

// Import Components
import BottomNav from './components/BottomNav'
import ToggleTheme from './components/ToggleTheme'

const App = () => {
  return (
    <Router>
      <ToggleTheme />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/story-upload" element={<StoryUpload />} />
      </Routes>
      <BottomNav />
    </Router>
  )
}

export default App
