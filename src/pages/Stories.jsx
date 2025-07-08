import React, { useEffect, useRef, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!stories.length || paused) return;

    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          nextStory();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // adjust for speed
    return () => clearInterval(timerRef.current);
  }, [currentIndex, stories, paused]);

  const nextStory = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1 < stories.length ? prev + 1 : 0));
  };

  const prevStory = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : stories.length - 1));
  };

  const handleMouseDown = () => setPaused(true);
  const handleMouseUp = () => setPaused(false);

  const handleReply = () => {
    const story = stories[currentIndex];
    navigate(`/chat?to=${story.userId}`);
  };

  if (!stories.length) return <div className="text-center mt-20">No stories yet.</div>;

  const current = stories[currentIndex];

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Avatars */}
      <div className="flex p-2 space-x-2 overflow-x-auto">
        {stories.map((story, i) => (
          <img
            key={story.id}
            src={story.avatar || '/default-avatar.png'}
            alt="avatar"
            className={`w-10 h-10 rounded-full border-2 cursor-pointer ${
              i === currentIndex ? 'border-pink-500' : 'border-gray-500'
            }`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>

      {/* Progress Bars */}
      <div className="absolute top-12 left-0 right-0 px-4 flex space-x-1">
        {stories.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 bg-white bg-opacity-30 rounded"
          >
            <div
              className={`h-full ${
                i < currentIndex
                  ? 'bg-white'
                  : i === currentIndex
                  ? 'bg-white transition-all duration-50'
                  : ''
              }`}
              style={{ width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div
        className="w-full h-full flex items-center justify-center px-4"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {current.type === 'video' ? (
          <video src={current.url} autoPlay muted className="max-h-[90vh] rounded" />
        ) : (
          <img src={current.url} alt="story" className="max-h-[90vh] rounded" />
        )}
      </div>

      {/* Tap Zones */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2" onClick={prevStory}></div>
        <div className="w-1/2" onClick={nextStory}></div>
      </div>

      {/* Reply */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
        <button
          onClick={handleReply}
          className="bg-white text-black font-semibold px-4 py-2 rounded shadow"
        >
          Reply
        </button>
      </div>
    </div>
  );
                      }
