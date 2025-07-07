import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Video,
  Upload,
  UsersRound,
  Search,
} from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const icons = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <Video size={24} />, label: 'Reels', path: '/reels' },
    { icon: <Upload size={24} />, label: 'Upload', path: '/upload' },
    { icon: <UsersRound size={24} />, label: 'Accounts', path: '/accounts' },
    { icon: <Search size={24} />, label: 'Search', path: '/search' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around p-2">
        {icons.map(({ icon, label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center text-xs ${
              location.pathname === path ? 'text-black' : 'text-gray-400'
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
