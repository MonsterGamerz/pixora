import React from 'react'
import { Link } from 'react-router-dom'

const BottomNav = () => (
  <nav className="fixed bottom-0 w-full bg-gray-200 dark:bg-gray-800 p-3 flex justify-around text-xl">
    <Link to="/">🏠</Link>
    <Link to="/upload">📤</Link>
    <Link to="/reels">🎬</Link>
    <Link to="/stories">📖</Link>
    <Link to="/chat">💬</Link>
  </nav>
)

export default BottomNav
