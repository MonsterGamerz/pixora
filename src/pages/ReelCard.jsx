// src/components/ReelCard.jsx
import React from 'react'

export default function ReelCard({ reel }) {
  return (
    <div className="h-screen w-full flex flex-col justify-between bg-black text-white snap-start">
      <video
        src={reel.videoUrl}
        className="w-full h-full object-cover"
        controls
        autoPlay
        loop
        muted
      ></video>

      <div className="absolute bottom-10 left-4 text-left">
        <h2 className="text-lg font-semibold">@{reel.username}</h2>
        <p className="text-sm text-gray-300">{reel.caption}</p>
        <div className="flex gap-4 mt-2">
          <button>❤️ {reel.likes?.length || 0}</button>
          <button>💬 {reel.comments?.length || 0}</button>
        </div>
      </div>
    </div>
  )
}
