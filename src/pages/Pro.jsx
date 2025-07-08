// src/pages/Pro.jsx
import React from 'react';
import { handleCheckout, stripePrices } from '../utils/stripe';

export default function Pro() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 via-black to-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white/10 p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Upgrade to Pixora Pro 🚀</h1>
        <p className="text-gray-300 mb-6">
          Unlock powerful features to grow faster:
        </p>

        <ul className="text-left text-gray-200 mb-8 space-y-2">
          <li>✅ Upload unlimited videos</li>
          <li>✅ See who viewed your stories</li>
          <li>✅ AI caption assistant</li>
          <li>✅ Verified Pro badge on your profile</li>
          <li>✅ Priority support & upcoming perks</li>
        </ul>

        <button
          onClick={() => handleCheckout(stripePrices.pro.priceId)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200"
        >
          Subscribe to Pixora Pro – ${stripePrices.pro.amount / 100}/month
        </button>

        <p className="mt-4 text-xs text-gray-400">
          Powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
