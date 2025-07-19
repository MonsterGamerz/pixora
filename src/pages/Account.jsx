import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection, query, where } from 'firebase/firestore';

const Account = () => {
  const { uid } = useParams(); // /account/:uid
  const [userData, setUserData] = useState({});
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid || !currentUserId) return;

    const fetchUser = async () => {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        setIsCurrentUser(uid === currentUserId);
        setIsFollowing(userSnap.data()?.followers?.includes(currentUserId));
      }
    };

    const q = query(collection(db, 'posts'), where('uid', '==', uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    fetchUser();
    return () => unsubscribe();
  }, [uid, currentUserId]);

  const handleFollowToggle = async () => {
    const userRef = doc(db, 'users', uid);
    const currentUserRef = doc(db, 'users', currentUserId);

    if (isFollowing) {
      await updateDoc(userRef, { followers: arrayRemove(currentUserId) });
      await updateDoc(currentUserRef, { following: arrayRemove(uid) });
    } else {
      await updateDoc(userRef, { followers: arrayUnion(currentUserId) });
      await updateDoc(currentUserRef, { following: arrayUnion(uid) });
    }

    setIsFollowing(!isFollowing);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex flex-col items-center bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg">
        <img
          src={userData.profilePic || '/default-avatar.png'}
          className="w-24 h-24 rounded-full object-cover mb-2"
          alt="Profile"
        />
        <h2 className="text-xl font-bold dark:text-white">{userData.username}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center">{userData.bio}</p>

        <div className="flex gap-6 mt-4 text-center">
          <div>
            <p className="text-lg font-bold dark:text-white">{userPosts.length}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <p className="text-lg font-bold dark:text-white">{userData.followers?.length || 0}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold dark:text-white">{userData.following?.length || 0}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>

        {isCurrentUser ? (
          <Link to="/edit-profile" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl">
            Edit Profile
          </Link>
        ) : (
          <button
            onClick={handleFollowToggle}
            className={`mt-4 px-4 py-2 rounded-xl text-white ${
              isFollowing ? 'bg-gray-500' : 'bg-blue-500'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-6">
        {userPosts.map((post) => (
          <div key={post.id}>
            {post.mediaUrl.includes('video') ? (
              <video src={post.mediaUrl} className="w-full h-32 object-cover rounded-lg" controls />
            ) : (
              <img src={post.mediaUrl} className="w-full h-32 object-cover rounded-lg" alt="" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Account;
