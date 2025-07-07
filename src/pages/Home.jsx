import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen p-4 pt-16">
      {/* Header with Chat Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate('/chat')}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* Content */}
      <h1 className="text-2xl font-bold">Welcome to Pixora</h1>
      <p className="text-gray-600 mt-2">Share your world with others!</p>

      {/* Add your posts/feed here */}
    </div>
  );
}
