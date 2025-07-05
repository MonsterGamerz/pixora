import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen p-6 pb-20 text-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-2 text-blue-600">Welcome to Pixora</h1>
      <p className="text-gray-500 mb-6">Share your world with others.</p>

      <div className="flex flex-col gap-4 items-center">
        <Link to="/upload" className="w-full max-w-sm px-4 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition">
          Upload a Post
        </Link>
        <Link to="/search" className="w-full max-w-sm px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition">
          Search Users
        </Link>
        <Link to="/accounts" className="w-full max-w-sm px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition">
          Browse Accounts
        </Link>
      </div>

      <div className="mt-10 text-sm text-gray-400">
        Built with ❤️ by Pixora
      </div>
    </div>
  )
}
