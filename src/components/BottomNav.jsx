import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Search, MessageCircle, Users } from 'lucide-react';

export default function BottomNav() {
  const { pathname } = useLocation();

  const navStyle = (path) =>
    `flex flex-col items-center text-xs ${
      pathname === path ? 'text-blue-500' : 'text-gray-500'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around p-2 z-50">
      <Link to="/" className={navStyle('/')}>
        <Home size={20} />
        Home
      </Link>
      <Link to="/upload" className={navStyle('/upload')}>
        <Upload size={20} />
        Upload
      </Link>
      <Link to="/search" className={navStyle('/search')}>
        <Search size={20} />
        Search
      </Link>
      <Link to="/chat" className={navStyle('/chat')}>
        <MessageCircle size={20} />
        Chat
      </Link>
      <Link to="/accounts" className={navStyle('/accounts')}>
        <Users size={20} />
        Accounts
      </Link>
    </nav>
  );
}
