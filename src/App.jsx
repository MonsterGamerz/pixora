// src/App.jsx
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

// Pages
import Home from './pages/Home'
import Upload from './pages/Upload'
import Reels from './pages/Reels'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Comments from './pages/Comments'
import Account from './pages/Account'
import EditProfile from './pages/EditProfile'

// UI
import BottomNav from './components/BottomNav'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) return <div className="text-white p-4">Loading your account...</div>

  return (
    <Router>
      {user && <BottomNav />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
        <Route path="/reels" element={user ? <Reels /> : <Navigate to="/login" />} />
        <Route path="/account/:id" element={user ? <Account /> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/post/:id/comments" element={user ? <Comments /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  )
}
