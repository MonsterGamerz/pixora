import React, { useEffect, useState } from 'react'; import { collection, getDocs, query, where } from 'firebase/firestore'; import { db } from '../firebase'; import { Link } from 'react-router-dom'; import { Clock } from 'lucide-react';

export default function Search() { const [searchTerm, setSearchTerm] = useState(''); const [results, setResults] = useState([]); const [recent, setRecent] = useState(() => { const stored = localStorage.getItem('recentSearches'); return stored ? JSON.parse(stored) : []; });

const handleSearch = async () => { if (!searchTerm.trim()) return;

const q = query(
  collection(db, 'users'),
  where('username', '>=', searchTerm),
  where('username', '<=', searchTerm + '\uf8ff')
);
const snapshot = await getDocs(q);
const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
setResults(users);

if (!recent.includes(searchTerm)) {
  const updated = [searchTerm, ...recent.slice(0, 4)];
  setRecent(updated);
  localStorage.setItem('recentSearches', JSON.stringify(updated));
}

};

useEffect(() => { if (searchTerm) handleSearch(); else setResults([]); }, [searchTerm]);

return ( <div className="max-w-xl mx-auto p-4"> <div className="flex items-center mb-4"> <input type="text" placeholder="Search by username..." className="w-full p-2 border rounded" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /> </div>

{searchTerm === '' && recent.length > 0 && (
    <div className="mb-4">
      <h2 className="font-semibold mb-2">Recent Searches</h2>
      <ul className="space-y-1">
        {recent.map((term, index) => (
          <li
            key={index}
            className="text-blue-600 cursor-pointer"
            onClick={() => setSearchTerm(term)}
          >
            <Clock className="inline w-4 h-4 mr-1 text-gray-400" /> {term}
          </li>
        ))}
      </ul>
    </div>
  )}

  {results.map(user => (
    <Link
      to={`/profile/${user.uid}`}
      key={user.uid}
      className="block p-2 border-b"
    >
      <strong>{user.username}</strong> <span className="text-gray-500">{user.bio}</span>
    </Link>
  ))}
</div>

); }

