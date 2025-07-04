// src/pages/Assistant.jsx
import React, { useState } from 'react'
import axios from "axios";

export default function Assistant() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')

    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
          },
        }
      )

      const reply = res.data.choices[0].message.content
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error getting response 😞' }])
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🤖 Pixora Assistant</h1>
      <div className="h-[60vh] overflow-y-auto bg-gray-100 rounded p-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <p className={`inline-block px-3 py-2 rounded ${msg.role === 'user' ? 'bg-blue-200' : 'bg-green-200'}`}>
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border px-4 py-2 rounded"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  )
}
