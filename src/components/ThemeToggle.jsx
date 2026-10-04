import { useEffect, useState } from 'react'

// auto = follow the system; light / dark = the visitor's own choice, remembered on this device.
const ORDER = ['auto', 'light', 'dark']
const LABEL = { auto: 'Auto', light: 'Light', dark: 'Dark' }

const readMode = () => {
  try {
    const saved = window.localStorage.getItem('theme')
    return saved === 'light' || saved === 'dark' ? saved : 'auto'
  } catch {
    return 'auto'
  }
}

const Icon = ({ mode }) => {
  if (mode === 'light') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
      </svg>
    )
  }
  if (mode === 'dark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
    </svg>
  )
}

const ThemeToggle = () => {
  const [mode, setMode] = useState(readMode)

  useEffect(() => {
    const root = document.documentElement
    if (mode === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', mode)

    try {
      if (mode === 'auto') window.localStorage.removeItem('theme')
      else window.localStorage.setItem('theme', mode)
    } catch {
      // storage can be unavailable; the choice then just lasts for this visit
    }
  }, [mode])

  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setMode(next)}
      title={`Theme: ${LABEL[mode]}. Click for ${LABEL[next]}.`}
      aria-label={`Colour theme: ${LABEL[mode]}. Switch to ${LABEL[next]}.`}
    >
      <Icon mode={mode} />
      <span className="theme-label">{LABEL[mode]}</span>
    </button>
  )
}

export default ThemeToggle
