// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Stories from './pages/Stories';
import Chat from './pages/Chat';
import Account from './pages/Account';
import EditProfile from './pages/EditProfile';
import CommentsPage from './pages/CommentsPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BottomNav from './components/BottomNav';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function AuthGuard({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
    });
    return unsubscribe;
  }, [navigate]);

  return children;
}

function App() {
  return (
    <Router>
      <div className="pb-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />
          <Route
            path="/upload"
            element={
              <AuthGuard>
                <Upload />
              </AuthGuard>
            }
          />
          <Route
            path="/stories"
            element={
              <AuthGuard>
                <Stories />
              </AuthGuard>
            }
          />
          <Route
            path="/chat"
            element={
              <AuthGuard>
                <Chat />
              </AuthGuard>
            }
          />
          <Route
            path="/account/:id?"
            element={
              <AuthGuard>
                <Account />
              </AuthGuard>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <AuthGuard>
                <EditProfile />
              </AuthGuard>
            }
          />
          <Route
            path="/post/:id/comments"
            element={
              <AuthGuard>
                <CommentsPage />
              </AuthGuard>
            }
          />
        </Routes>

        {/* Show BottomNav only if logged in */}
        <AuthWrapper>
          <BottomNav />
        </AuthWrapper>
      </div>
    </Router>
  );
}

function AuthWrapper({ children }) {
  const [loggedIn, setLoggedIn] = React.useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  return loggedIn ? children : null;
}

export default App;
