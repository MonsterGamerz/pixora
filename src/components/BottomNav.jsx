import React from 'react';
import { Home, Upload, Film, MessageSquare, Bot } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: <Home />, label: 'Home' },
    { to: '/upload', icon: <Upload />, label: 'Upload' },
    { to: '/reels', icon: <Film />, label: 'Reels' },
    { to: '/inbox', icon: <MessageSquare />, label: 'Inbox' },
    { to: '/ai', icon: <Bot />, label: 'AI' }, // 👈 NEW
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 shadow z-50">
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.to}
          className={`flex flex-col items-center text-xs ${
            location.pathname === item.to ? 'text-black' : 'text-gray-400'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
