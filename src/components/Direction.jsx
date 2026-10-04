import { direction } from '../data/cv.js'
import { useReveal } from '../hooks.js'
import ContourField from './ContourField.jsx'

const Direction = () => {
  const reveal = useReveal()
  return (
    <aside className={`direction ${reveal.className}`} ref={reveal.ref}>
      <div className="direction-art" aria-hidden="true">
        <ContourField variant="planned" />
      </div>
      <div className="wrap direction-inner">
        <p className="direction-kicker">Where this goes next</p>
        <h2>{direction.title}</h2>
        <p className="direction-text">{direction.text}</p>
      </div>
    </aside>
  )
}

export default Direction
