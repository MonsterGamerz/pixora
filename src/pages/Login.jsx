// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🚀 redirect if already logged in
  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      if (user) {
        // look up user doc to see if username exists
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          navigate(`/account/${user.uid}`);
        } else {
          navigate("/");
        }
      }
    };

    redirectIfLoggedIn();
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // fetch user profile after login
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        navigate(`/account/${res.user.uid}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleLogin} className="bg-gray-900 p-6 rounded-lg w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Welcome back to Pixora</h2>

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
          Log In
        </button>

        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-pink-400 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
