import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

// Pages
import Home from './pages/Home'
import Upload from './pages/Upload'
import Reels from './pages/Reels'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Accounts from './pages/Accounts'
import Search from './pages/Search'
import Notifications from './pages/Notifications'

// Components
import BottomNav from './components/BottomNav'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <Router>
      {user && <BottomNav />}
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
        <Route path="/reels" element={user ? <Reels /> : <Navigate to="/login" />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/accounts" element={user ? <Accounts /> : <Navigate to="/login" />} />
        <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
        <Route path="/profile/:uid" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
