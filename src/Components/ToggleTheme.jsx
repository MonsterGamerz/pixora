import React, { useEffect, useState } from 'react'

const ToggleTheme = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-2 right-2 px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded z-50"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}

export default ToggleTheme
