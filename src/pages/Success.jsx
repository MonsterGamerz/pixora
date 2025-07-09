// src/pages/Success.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 text-center p-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful! 🎉</h1>
      <p className="text-gray-700 mb-6">Thanks for upgrading to Pixora Pro. Enjoy your new features!</p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
}
