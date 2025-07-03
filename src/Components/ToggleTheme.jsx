import React from 'react'

const ToggleTheme = () => {
  const toggle = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <button
      onClick={toggle}
      className="fixed top-2 right-2 px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
    >
      🌓
    </button>
  )
}

export default ToggleTheme
