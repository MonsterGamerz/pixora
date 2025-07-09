import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Video,
  Upload,
  User,
  Search,
} from "lucide-react";

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 flex justify-around py-2 z-50">
      <Link to="/" className={`flex flex-col items-center ${isActive("/") ? "text-blue-500" : "text-gray-500"}`}>
        <Home size={24} />
        <span className="text-xs">Home</span>
      </Link>

      <Link to="/reels" className={`flex flex-col items-center ${isActive("/reels") ? "text-blue-500" : "text-gray-500"}`}>
        <Video size={24} />
        <span className="text-xs">Reels</span>
      </Link>

      <Link to="/upload" className={`flex flex-col items-center ${isActive("/upload") ? "text-blue-500" : "text-gray-500"}`}>
        <Upload size={24} />
        <span className="text-xs">Upload</span>
      </Link>

      <Link to="/search" className={`flex flex-col items-center ${isActive("/search") ? "text-blue-500" : "text-gray-500"}`}>
        <Search size={24} />
        <span className="text-xs">Search</span>
      </Link>

      <Link to="/account" className={`flex flex-col items-center ${isActive("/account") ? "text-blue-500" : "text-gray-500"}`}>
        <User size={24} />
        <span className="text-xs">Account</span>
      </Link>
    </div>
  );
}
