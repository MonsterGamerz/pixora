// src/components/RequirePro.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'

const RequirePro = ({ user, children }) => {
  if (!user?.isPro) {
    return <Navigate to="/pro" />
  }
  return children
}

export default RequirePro
