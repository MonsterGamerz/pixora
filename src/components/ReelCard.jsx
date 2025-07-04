import React, { useRef, useEffect } from "react"

function ReelCard({ videoUrl, username, caption }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return
      const rect = videoRef.current.getBoundingClientRect()
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight
      if (isVisible) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="snap-start h-screen flex flex-col justify-end items-center relative">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover absolute top-0 left-0"
        loop
        muted
        playsInline
      ></video>

      <div className="relative z-10 bg-black bg-opacity-50 text-white p-4 w-full">
        <p className="text-lg font-semibold">@{username}</p>
        <p>{caption}</p>
      </div>
    </div>
  )
}

export default ReelCard
