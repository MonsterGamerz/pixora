import React from 'react'
import logo from '../assets/logo.jpg' // Make sure this path matches your actual logo file

export default function LoadingScreen() {
  const styles = {
    container: {
      height: '100vh',
      width: '100%',
      backgroundColor: '#000',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      marginBottom: '20px',
      borderRadius: '50%',
      border: '2px solid white',
    },
    spinner: {
      border: '4px solid rgba(255, 255, 255, 0.2)',
      borderLeftColor: '#fff',
      height: '40px',
      width: '40px',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    text: {
      marginTop: '10px',
      fontSize: '1rem',
      opacity: 0.8,
    },
  }

  return (
    <div style={styles.container}>
      <img src={logo} alt="Pixora Logo" style={styles.logo} />
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading Pixora...</p>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}
