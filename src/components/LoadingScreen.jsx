import React from 'react'
import logo from '../assets/logo.png' // Replace with your actual logo path

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <img src={logo} alt="Pixora" className="w-16 h-16 mb-4 animate-bounce" />
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-white h-12 w-12 mb-2 animate-spin"></div>
      <p className="text-sm opacity-75">Loading Pixora...</p>
    </div>
  )
}
