// src/App.jsx
import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import Home from "./pages/Home"
import Reels from "./pages/Reels"
import Upload from "./pages/Upload"
import Chat from "./pages/Chat"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Search from "./pages/Search"
import Accounts from "./pages/Accounts"
import BottomNav from "./components/BottomNav"
import LoadingScreen from "./components/LoadingScreen"

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <Router>
      {user && <BottomNav />}
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile/:uid" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/account" element={<Accounts />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  )
}
