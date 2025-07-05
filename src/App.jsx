import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Reels from './pages/Reels'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile/:uid" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <BottomNav />
    </Router>
  )
}
