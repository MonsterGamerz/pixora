// src/pages/Signup.jsx
import React, { useState } from 'react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Set display name
      await updateProfile(user, { displayName: username })

      // Create user doc in "users" collection
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        bio: '',
        photoURL: '', // You can set default avatar later
        followers: [],
        following: []
      })

      // Create username mapping in "usernames" collection
      await setDoc(doc(db, 'usernames', username), {
        uid: user.uid
      })

      // Redirect to home
      navigate('/')
    } catch (err) {
      console.error('Signup error:', err)
      setError('Signup failed. Try a different email/username.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleSignup} className="bg-gray-900 p-6 rounded-lg w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Create your Pixora account</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 transition rounded py-2 font-semibold"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
