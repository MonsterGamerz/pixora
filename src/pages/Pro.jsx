// src/pages/Pro.jsx
import React from 'react'
import { createCheckout } from '../utils/stripe'

export default function Pro() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">💎 Upgrade to Pixora Pro</h1>
      <p className="mb-6">Unlock uploads, stories, chats, assistant and more.</p>
      <button
        onClick={createCheckout}
        className="bg-purple-600 text-white px-6 py-3 rounded text-lg"
      >
        Go Pro – $5/month
      </button>
    </div>
  )
}
