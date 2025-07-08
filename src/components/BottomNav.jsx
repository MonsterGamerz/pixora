import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  PlusSquare,
  Video,
  MessageCircle,
  User
} from 'lucide-react';

export default function BottomNav() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', icon: <HomeIcon />, label: 'Home' },
    { to: '/search', icon: <SearchIcon />, label: 'Search' },
    { to: '/upload', icon: <PlusSquare />, label: 'Upload' },
    { to: '/stories', icon: <Video />, label: 'Stories' },
    { to: '/chat', icon: <MessageCircle />, label: 'Chat' },
    { to: '/account', icon: <User />, label: 'Account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {links.map(({ to, icon, label }) => (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center text-sm ${
            pathname.startsWith(to) ? 'text-pink-600' : 'text-gray-500'
          }`}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
