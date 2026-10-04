import { useEvidence } from './EvidenceContext.jsx'

// A small floating bar while a skill is selected, so the highlighted entries make sense.
const EvidenceBar = () => {
  const { skill, hits, next, clear } = useEvidence()
  if (!skill) return null

  return (
    <div className="evidence-bar" role="status">
      <span>
        Work that shows <strong>{skill}</strong>: {hits.length} {hits.length === 1 ? 'entry' : 'entries'}
      </span>
      {hits.length > 1 && (
        <button type="button" onClick={next}>
          Next
        </button>
      )}
      <button type="button" onClick={clear} aria-label="Clear skill highlight">
        Clear
      </button>
    </div>
  )
}

export default EvidenceBar
