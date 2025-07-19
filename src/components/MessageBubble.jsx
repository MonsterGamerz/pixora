import React from 'react';

const MessageBubble = ({ message, currentUser }) => {
  const isMe = message.senderId === currentUser.uid;

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs p-2 px-3 rounded-2xl shadow ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
        {message.text}
        <div className="text-xs opacity-60 mt-1">{new Date(message.createdAt).toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
