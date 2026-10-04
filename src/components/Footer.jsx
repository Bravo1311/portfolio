import { profile } from '../data/cv.js'
import { analyticsOn } from '../lib/analytics.js'

const Footer = () => (
  <footer className="footer">
    <p>{profile.availability}</p>
    <a href={profile.links[0].href}>{profile.links[0].label}</a>
    {analyticsOn() && <p className="footer-note">Visits are counted anonymously, without cookies.</p>}
  </footer>
)

export default Footer
