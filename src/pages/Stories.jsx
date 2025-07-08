import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Stories() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold">Stories</h1>
      </div>

      {/* Content */}
      <div className="text-center text-gray-500">
        <p>Stories feature is coming soon 👀</p>
        <p className="mt-2 text-sm">You’ll be able to upload 24-hour stories just like Instagram and Snapchat.</p>
      </div>
    </div>
  );
}
