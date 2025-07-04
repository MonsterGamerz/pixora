// src/components/FollowButton.jsx
import React, { useState } from 'react';

const FollowButton = ({ initialFollowed = false }) => {
  const [followed, setFollowed] = useState(initialFollowed);

  const handleFollow = () => {
    setFollowed(!followed);
    // You can add Firestore logic here to update following status
  };

  return (
    <button
      onClick={handleFollow}
      className={`px-4 py-2 rounded-full font-semibold ${
        followed ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'
      }`}
    >
      {followed ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
