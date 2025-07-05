import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Upload, Video, MessageCircle, Search, User, Bell } from 'lucide-react'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-14 z-50 dark:bg-black dark:border-gray-800">
      <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-500'}>
        <Home size={24} />
      </NavLink>

      <NavLink to="/search" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-500'}>
        <Search size={24} />
      </NavLink>

      <NavLink to="/upload" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-500'}>
        <Upload size={24} />
      </NavLink>

      <NavLink to="/reels" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-500'}>
        <Video size={24} />
      </NavLink>

      <NavLink to="/chat" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-500'}>
        <MessageCircle size={24} />
      </NavLink>

      <NavLink to="/accounts" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-500'}>
        <User size={24} />
      </NavLink>

      <NavLink to="/notifications" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-500'}>
        <Bell size={24} />
      </NavLink>
    </nav>
  )
}
