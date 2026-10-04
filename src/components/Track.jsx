import Entry from './Entry.jsx'
import { useReveal } from '../hooks.js'

const ORDINAL = ['01', '02', '03']

const Track = ({ track, index }) => {
  const reveal = useReveal()
  const count = track.entries.length

  return (
    <section
      className={`track track-${index} ${reveal.className}`}
      id={track.id}
      ref={reveal.ref}
    >
      <div className="wrap track-inner">
        <div className="track-head">
          <span className="track-numeral" aria-hidden="true">
            {ORDINAL[index - 1] || index}
          </span>
          <h2 className="track-name">{track.name}</h2>
          <p className="track-line">{track.line}</p>
        </div>

        <div className={`entries entries-${count}`}>
          {track.entries.map((entry) => (
            <Entry key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Track
