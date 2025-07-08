// src/pages/Reels.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Reels() {
  const [videos, setVideos] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

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

  const handleLike = async (postId, hasLiked) => {
    const postRef = doc(db, 'posts', postId);
    if (!auth.currentUser) return;

    await updateDoc(postRef, {
      likes: hasLiked
        ? arrayRemove(auth.currentUser.uid)
        : arrayUnion(auth.currentUser.uid)
    });
  };

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map((v) => {
        const hasLiked = v.likes?.includes(auth.currentUser?.uid);

        return (
          <div key={v.id} className="reel-item snap-center h-screen relative">
            <video
              src={v.url}
              className="object-contain h-full w-full"
              loop
              muted
              controls={false}
              playsInline
            />
            
            {/* Overlay */}
            <div className="absolute bottom-20 left-4 text-white">
              <p className="font-semibold">@{v.username || 'unknown'}</p>
              <p className="text-sm">{v.caption}</p>
            </div>

            <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-4 text-white">
              <button onClick={() => handleLike(v.id, hasLiked)}>
                <Heart className={`w-6 h-6 ${hasLiked ? 'text-red-500' : 'text-white'}`} />
              </button>
              <button onClick={() => navigate(`/post/${v.id}/comments`)}>
                <MessageCircle className="w-6 h-6" />
              </button>
              <button onClick={() => navigator.share?.({ url: window.location.href })}>
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
