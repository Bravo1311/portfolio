import { direction } from '../data/cv.js'
import { useReveal } from '../hooks.js'
import LoopArt from './LoopArt.jsx'

const Direction = () => {
  const reveal = useReveal()
  return (
    <aside className={`direction ${reveal.className}`} ref={reveal.ref}>
      <div className="wrap direction-inner">
        <div className="direction-copy">
          <p className="direction-kicker">Where this goes next</p>
          <h2>{direction.title}</h2>
          <p className="direction-text">{direction.text}</p>
        </div>
        <div className="direction-loop">
          <LoopArt />
        </div>
      </div>
    </aside>
  )
}

export default Direction
