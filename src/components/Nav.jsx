import { useScrollSpy } from '../hooks.js'
import ThemeToggle from './ThemeToggle.jsx'
import { DepthSwitch } from './DepthControl.jsx'

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
      <div className="nav-depth">
        <span className="nav-depth-label">Detail</span>
        <DepthSwitch />
      </div>
      <ThemeToggle />
      </div>
    </nav>
  )
}

export default Nav
