import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Upload from './pages/Upload'
import Reels from './pages/Reels'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import BottomNav from './components/BottomNav'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  return (
    <Router>
      {user && <BottomNav />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* All the routes below require login */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />
        <Route
          path="/reels"
          element={
            <PrivateRoute>
              <Reels />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:uid"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}
