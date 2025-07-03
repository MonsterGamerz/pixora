// src/components/StoryViewer.jsx
import React from 'react'

const StoryViewer = ({ story, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
      <img src={story.imageURL} className="max-h-[80vh] rounded-xl" />
      <p className="text-white mt-2">{story.caption}</p>
      <button onClick={onClose} className="mt-4 text-red-500 underline">Close</button>
    </div>
  )
}

export default StoryViewer
