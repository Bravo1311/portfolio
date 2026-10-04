import { profile } from '../data/cv.js'
import { analyticsOn } from '../lib/analytics.js'

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
)

const ICONS = {
  mail: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Icon>
  ),
  phone: (
    <Icon>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </Icon>
  ),
  linkedin: (
    <Icon>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 11v6M8 7.5v.01M12 17v-6M12 13.5a2.5 2.5 0 0 1 5 0V17" />
    </Icon>
  ),
  github: (
    <Icon>
      <path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.5-.5-2.3 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.500 2.500 5.400 2.800 5.400 2.800a4.300 4.300 0 0 0-.1 3.200A4.600 4.600 0 0 0 4 9.200c0 4.600 2.700 5.700 5.500 6-.6.600-.6 1.200-.5 2.300V21" />
    </Icon>
  ),
  pin: (
    <Icon>
      <path d="M12 21s-7-6.200-7-11a7 7 0 0 1 14 0c0 4.800-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.500" />
    </Icon>
  ),
}

const kindOf = (href) => {
  if (href.startsWith('mailto:')) return 'mail'
  if (href.startsWith('tel:')) return 'phone'
  if (href.includes('linkedin')) return 'linkedin'
  return 'github'
}

const Footer = () => (
  <footer className="footer">
    <div className="wrap footer-inner">
      <div>
        <h2 className="footer-title">Get in touch</h2>
        <p className="footer-place">
          {ICONS.pin}
          {profile.location}
        </p>
      </div>

      <ul className="contact">
        {profile.links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>
              {ICONS[kindOf(link.href)]}
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="footer-bottom">
        <p>
          {profile.name} · {profile.role}
        </p>
        {analyticsOn() && <p className="footer-note">Visits are counted anonymously, without cookies.</p>}
      </div>
    </div>
  </footer>
)

export default Footer
