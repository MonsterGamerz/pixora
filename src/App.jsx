import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Account from "./pages/Account";
import Upload from "./pages/Upload";
import Reels from "./pages/Reels";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inbox from "./pages/Inbox";
import CommentsPage from "./pages/CommentsPage";
import EditProfile from "./pages/EditProfile";
import StoryUpload from "./pages/StoryUpload";
import StoryViewer from "./components/StoryViewer";
import Search from "./pages/Search";
import Pro from "./pages/Pro";
import Success from "./pages/Success";
import AI from "./pages/AI";

import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reels"
            element={
              <ProtectedRoute>
                <Reels />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox/:chatId"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comments/:postId"
            element={
              <ProtectedRoute>
                <CommentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/story-upload"
            element={
              <ProtectedRoute>
                <StoryUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/story-viewer"
            element={
              <ProtectedRoute>
                <StoryViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pro"
            element={
              <ProtectedRoute>
                <Pro />
              </ProtectedRoute>
            }
          />
          <Route path="/success" element={<Success />} />
          <Route
            path="/ai"
            element={
              <ProtectedRoute>
                <AI />
                <BottomNav />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
