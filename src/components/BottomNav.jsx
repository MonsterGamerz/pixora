// src/components/BottomNav.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  PlusSquare,
  Video,
  Search as SearchIcon,
  User,
  LogOut
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', icon: <HomeIcon />, label: 'Home' },
    { to: '/search', icon: <SearchIcon />, label: 'Search' },
    { to: '/upload', icon: <PlusSquare />, label: 'Upload' },
    { to: '/stories', icon: <Video />, label: 'Stories' },
    { to: '/reels', icon: <Video />, label: 'Reels' },
    { to: '/account', icon: <User />, label: 'Account' }
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2">
      {links.map(({ to, icon, label }) => (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center text-sm ${pathname.startsWith(to) ? 'text-pink-600' : 'text-gray-500'}`}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-sm text-red-500"
      >
        <LogOut />
        <span>Logout</span>
      </button>
    </nav>
  );
}
