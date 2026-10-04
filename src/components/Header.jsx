import { useEffect, useRef } from 'react'
import { profile } from '../data/cv.js'
import ContourField from './ContourField.jsx'

// The two endpoints are the world outside your work; the middle three are yours and link down the page.
const CHAIN = [
  { id: null, label: 'Sensing' },
  { id: 'estimation', label: 'Estimation' },
  { id: 'integration', label: 'Integration' },
  { id: 'policy', label: 'Policy' },
  { id: null, label: 'Action' },
]

// Pauses the endless hero animations (drone, glow, flares) together while the hero is off screen,
// so they resume in step. Finished one-shot animations are left alone.
const usePauseOffscreen = (ref) => {
  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window) || !node.getAnimations) return
    const observer = new IntersectionObserver(([entry]) => {
      const svg = node.querySelector('.contour')
      const loops = node.getAnimations({ subtree: true }).filter((a) => a.effect && a.effect.getComputedTiming().iterations === Infinity)
      if (entry.isIntersecting) {
        if (svg) svg.unpauseAnimations()
        loops.forEach((a) => a.play())
      } else {
        if (svg) svg.pauseAnimations()
        loops.forEach((a) => a.pause())
      }
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])
}

const Header = () => {
  const ref = useRef(null)
  usePauseOffscreen(ref)
  return (
  <header className="hero" ref={ref}>
    <div className="wrap hero-inner">
      <div className="hero-text">
        <p className="role">{profile.role}</p>
        <h1>{profile.name}</h1>
        <p className="claim">{profile.claim}</p>
        <ul className="print-contact">
          <li>{profile.location}</li>
          {profile.links.map((link) => (
            <li key={link.href}>{link.label}</li>
          ))}
        </ul>
      </div>

      <div className="hero-art">
        <ContourField />
      </div>

      <div className="hero-foot">
        <ol className="chain" aria-label="The autonomy stack, bottom to top">
          {CHAIN.map((node, i) => (
            <li
              key={node.label}
              className={node.id ? 'chain-node chain-own' : 'chain-node chain-edge'}
              style={{ '--i': i }}
            >
              {node.id ? <a href={`#${node.id}`}>{node.label}</a> : <span>{node.label}</span>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  </header>
  )
}

export default Header
