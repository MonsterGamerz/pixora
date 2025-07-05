import React from 'react'
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const { pathname } = useLocation()

  const linkStyle = (path) =>
    pathname === path ? 'text-blue-500' : 'text-gray-500'

  return (
    <div className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2 z-50">
      <Link to="/" className={linkStyle('/')}>
        <Home size={28} />
      </Link>
      <Link to="/search" className={linkStyle('/search')}>
        <Search size={28} />
      </Link>
      <Link to="/upload" className={linkStyle('/upload')}>
        <Plus size={28} />
      </Link>
      <Link to="/chat" className={linkStyle('/chat')}>
        <MessageCircle size={28} />
      </Link>
      <Link to="/accounts" className={linkStyle('/accounts')}>
        <User size={28} />
      </Link>
    </div>
  )
}
