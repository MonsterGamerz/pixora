import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed
import { Link } from "react-router-dom";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("username", ">=", searchInput.toLowerCase()),
        where("username", "<=", searchInput.toLowerCase() + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      setResults(users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search username..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p>Searching...</p>}

      {results.length > 0 ? (
        <ul className="space-y-2">
          {results.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <span>@{user.username}</span>
              <Link
                to={`/account/${user.id}`}
                className="text-blue-500 hover:underline"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No users found</p>
      )}
    </div>
  );
};

export default Search;
