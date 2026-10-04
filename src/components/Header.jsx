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

const Header = () => (
  <header className="hero">
    <div className="wrap hero-inner">
      <div className="hero-text">
        <p className="role">{profile.role}</p>
        <h1>{profile.name}</h1>
        <p className="claim">{profile.claim}</p>
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

export default Header
