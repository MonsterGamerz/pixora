// src/pages/Signup.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        username,
        createdAt: new Date(),
        followers: [],
        following: [],
      });

      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="p-4 max-w-sm mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />
      <button type="submit" className="w-full bg-black text-white py-2 rounded">
        Sign Up
      </button>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
