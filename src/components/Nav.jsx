import { useEffect, useState } from 'react'
import { useScrollSpy } from '../hooks.js'
import ThemeToggle from './ThemeToggle.jsx'
import { profile } from '../data/cv.js'
import { track } from '../lib/analytics.js'

const SECTIONS = [
  { id: 'estimation', label: 'Estimation' },
  { id: 'integration', label: 'Integration' },
  { id: 'policy', label: 'Policy' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
]

// The hero's chain, kept in the bar: it lights up as you move down through the stack.
const CHAIN = [
  { label: 'Sensing' },
  { id: 'estimation', label: 'Estimation' },
  { id: 'integration', label: 'Integration' },
  { id: 'policy', label: 'Policy' },
  { label: 'Action' },
]
const LAYERS = ['estimation', 'integration', 'policy']

const Nav = () => {
  const active = useScrollSpy(SECTIONS.map((s) => s.id))
  const [docked, setDocked] = useState(false)

  // The bar stays away while the hero's chain is on screen, and takes over once that chain has scrolled out of view.
  useEffect(() => {
    const chain = document.querySelector('.hero .chain')
    if (!chain || !('IntersectionObserver' in window)) {
      setDocked(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setDocked(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    observer.observe(chain)
    return () => observer.disconnect()
  }, [])

  const layer = LAYERS.indexOf(active)
  const reached = layer === -1 ? CHAIN.length : layer + 2

  const go = (id) => (event) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={`nav${docked ? ' nav-docked' : ''}`} aria-label="Page sections">
      <div className="wrap nav-inner">
      <ol className="nav-chain" aria-label="The autonomy stack">
        {CHAIN.map((node, i) => (
          <li key={node.label} style={{ '--i': i }} className={`nav-node ${node.id ? 'nav-node-own' : 'nav-node-edge'}${i < reached ? ' nav-node-lit' : ''}${node.id && node.id === active ? ' nav-node-here' : ''}`}>
            {node.id ? (
              <a href={`#${node.id}`} onClick={go(node.id)} aria-current={node.id === active ? 'true' : undefined}>
                {node.label}
              </a>
            ) : (
              <span>{node.label}</span>
            )}
            {i < CHAIN.length - 1 && <span className={`nav-seg${i + 1 < reached ? ' nav-seg-lit' : ''}`} aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <ol className="nav-links">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={go(section.id)}
              className={section.id === active ? 'nav-on' : ''}
              aria-current={section.id === active ? 'true' : undefined}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ol>
      <div className="nav-actions">
        <a className="nav-cta" href={profile.cv} download onClick={() => track('cv-download')}>
          CV
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
          </svg>
        </a>
        <a className="nav-cta nav-cta-main" href="#contact" onClick={go('contact')}>
          Contact
        </a>
        <ThemeToggle />
      </div>
      </div>
    </nav>
  )
}

export default Nav
