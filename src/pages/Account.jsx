// src/pages/Account.jsx import React, { useEffect, useState } from 'react' import { auth, db } from '../firebase' import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default function Account() { const [userData, setUserData] = useState(null) const [bio, setBio] = useState('') const user = auth.currentUser

useEffect(() => { const fetchData = async () => { if (user) { const ref = doc(db, 'users', user.uid) const snap = await getDoc(ref) if (snap.exists()) { setUserData(snap.data()) setBio(snap.data().bio || '') } } } fetchData() }, [user])

const handleUpdate = async () => { if (user) { const ref = doc(db, 'users', user.uid) await updateDoc(ref, { bio }) alert('Bio updated!') } }

if (!userData) return <p className="text-center mt-10">Loading account...</p>

return ( <div className="max-w-xl mx-auto p-6 text-center"> <h1 className="text-2xl font-bold">Account Settings</h1> <p className="text-gray-600">Username: {userData.username}</p> <textarea className="mt-4 p-2 w-full border rounded" placeholder="Your bio" value={bio} onChange={(e) => setBio(e.target.value)} /> <button
onClick={handleUpdate}
className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
> Update Bio </button> </div> ) }

  
