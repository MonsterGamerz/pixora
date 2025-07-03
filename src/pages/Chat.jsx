// src/pages/Chat.jsx
import React, { useState } from 'react'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className="flex h-screen">
      <ChatList onSelect={setSelectedUser} />
      {selectedUser ? (
        <ChatWindow recipient={selectedUser} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a user to start chatting
        </div>
      )}
    </div>
  )
}
