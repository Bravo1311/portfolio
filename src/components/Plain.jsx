import Entry from './Entry.jsx'

// A conventional section outside the spine. `variant` picks the layout:
// 'timeline' for a vertical line with dots, 'pair' for side-by-side blocks.
const Plain = ({ title, entries, id, variant = 'timeline' }) => (
  <section className="section" id={id}>
    <h2 className="section-title">{title}</h2>
    <div className={`plain plain-${variant}`}>
      {entries.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </div>
  </section>
)

export default Plain
