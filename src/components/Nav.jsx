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

const Nav = () => {
  const active = useScrollSpy(SECTIONS.map((s) => s.id))

  const go = (id) => (event) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="nav" aria-label="Page sections">
      <div className="wrap nav-inner">
      <ol>
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
