// src/pages/Reels.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  collection, query, where, onSnapshot, orderBy,
  doc, updateDoc, arrayUnion, arrayRemove, getDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import {
  Heart, MessageCircle, Send, UserPlus, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Reels() {
  const [videos, setVideos] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('type', '==', 'video'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, async (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const withUsernames = await Promise.all(items.map(async (item) => {
        const userDoc = await getDoc(doc(db, 'users', item.userId));
        return { ...item, username: userDoc.data()?.username || 'unknown' };
      }));
      setVideos(withUsernames);
    });
    return unsub;
  }, []);

  const handleObserver = useCallback((entries) => {
    entries.forEach((entry) => {
      const video = entry.target.querySelector('video');
      const id = entry.target.dataset.id;

      if (entry.isIntersecting) {
        video.play().catch(() => {});
        startProgress(id);
      } else {
        video.pause();
        stopProgress(id);
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

  const startProgress = (id) => {
    setProgressMap(prev => {
      if (prev[id]) return prev;

      const interval = setInterval(() => {
        setProgressMap(p => {
          const newVal = Math.min((p[id]?.value || 0) + 1, 100);
          if (newVal === 100) {
            clearInterval(p[id].interval);
            scrollToNext(id);
          }
          return {
            ...p,
            [id]: { ...p[id], value: newVal }
          };
        });
      }, 80);

      return {
        ...prev,
        [id]: { interval, value: 0, paused: false }
      };
    });
  };

  const stopProgress = (id) => {
    if (progressMap[id]) {
      clearInterval(progressMap[id].interval);
      setProgressMap(p => ({ ...p, [id]: undefined }));
    }
  };

  const scrollToNext = (currentId) => {
    const elements = Array.from(containerRef.current.querySelectorAll('.reel-item'));
    const currentIndex = elements.findIndex(e => e.dataset.id === currentId);
    if (currentIndex !== -1 && elements[currentIndex + 1]) {
      elements[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLike = async (postId, hasLiked) => {
    const postRef = doc(db, 'posts', postId);
    if (!auth.currentUser) return;

    await updateDoc(postRef, {
      likes: hasLiked
        ? arrayRemove(auth.currentUser.uid)
        : arrayUnion(auth.currentUser.uid)
    });
  };

  const handleFollow = async (userId, isFollowing) => {
    const currentId = auth.currentUser?.uid;
    if (!currentId || currentId === userId) return;

    const userRef = doc(db, 'users', currentId);
    const targetRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      following: isFollowing ? arrayRemove(userId) : arrayUnion(userId)
    });

    await updateDoc(targetRef, {
      followers: isFollowing ? arrayRemove(currentId) : arrayUnion(currentId)
    });
  };

  const togglePause = (id, videoRef) => {
    const entry = progressMap[id];
    if (!entry) return;

    if (entry.paused) {
      const interval = setInterval(() => {
        setProgressMap(p => {
          const newVal = Math.min((p[id]?.value || 0) + 1, 100);
          if (newVal === 100) {
            clearInterval(p[id].interval);
            scrollToNext(id);
          }
          return {
            ...p,
            [id]: { ...p[id], value: newVal, interval, paused: false }
          };
        });
      }, 80);
      videoRef.play();
      setProgressMap(p => ({
        ...p,
        [id]: { ...p[id], interval, paused: false }
      }));
    } else {
      clearInterval(entry.interval);
      videoRef.pause();
      setProgressMap(p => ({
        ...p,
        [id]: { ...p[id], paused: true }
      }));
    }
  };

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map((v) => {
        const hasLiked = v.likes?.includes(auth.currentUser?.uid);
        const isFollowing = v.followers?.includes(auth.currentUser?.uid);
        const progress = progressMap[v.id]?.value || 0;

        return (
          <div
            key={v.id}
            data-id={v.id}
            className="reel-item snap-center h-screen relative"
          >
            <video
              src={v.url}
              className="object-cover h-full w-full"
              loop
              muted
              playsInline
              onClick={(e) => togglePause(v.id, e.target)}
            />

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
              <div
                className="h-full bg-pink-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Overlay text */}
            <div className="absolute bottom-24 left-4 text-white">
              <p className="font-bold text-sm">@{v.username || 'unknown'}</p>
              <p className="text-xs">{v.caption}</p>
              <p className="text-xs text-gray-400">{v.audio || 'original audio'}</p>
            </div>

            {/* Overlay buttons */}
            <div className="absolute bottom-24 right-4 flex flex-col items-center space-y-4 text-white">
              <button onClick={() => handleLike(v.id, hasLiked)}>
                <Heart className={`w-6 h-6 ${hasLiked ? 'text-red-500' : 'text-white'}`} />
              </button>
              <button onClick={() => navigate(`/post/${v.id}/comments`)}>
                <MessageCircle className="w-6 h-6" />
              </button>
              <button onClick={() => navigator.share?.({ url: window.location.href })}>
                <Send className="w-6 h-6" />
              </button>
              <button onClick={() => handleFollow(v.userId, isFollowing)}>
                {isFollowing ? <UserCheck className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
