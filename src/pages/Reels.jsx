// src/pages/Reels.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function Reels() {
  const [videos, setVideos] = useState([]);
  const containerRef = useRef(null);

  // Fetch only video posts
  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('type', '==', 'video'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // Auto play/pause via IntersectionObserver
  const handleObserver = useCallback((entries) => {
    entries.forEach((entry) => {
      const video = entry.target.querySelector('video');
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: containerRef.current,
      threshold: 0.6,
    });
    const items = containerRef.current?.querySelectorAll('.reel-item');
    items?.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [videos, handleObserver]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
    >
      {videos.map((v) => (
        <div
          key={v.id}
          className="reel-item snap-center h-screen flex items-center justify-center bg-black"
        >
          <video
            src={v.url}
            className="max-h-full"
            loop
            muted
            controls={false}
            playsInline
          />
        </div>
      ))}
    </div>
  );
}
