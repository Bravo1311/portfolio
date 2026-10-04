import { useEffect, useId, useRef, useState } from 'react'
import Status from './Status.jsx'
import Media from './Media.jsx'
import { useDepth } from './DepthContext.jsx'
import { useEvidence } from './EvidenceContext.jsx'
import { copyText } from '../lib/clipboard.js'
import { track } from '../lib/analytics.js'

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
)

const Entry = ({ entry }) => {
  const { depth } = useDepth()
  const { hits } = useEvidence()
  const [open, setOpen] = useState(depth === 'deep')
  const [copy, setCopy] = useState('idle') // idle | done | manual
  const panelId = useId()
  const ref = useRef(null)

  // The depth control sets every entry; a click afterwards overrides just this one.
  useEffect(() => {
    setOpen(depth === 'deep')
  }, [depth])

  // A link such as #thesis-fgo opens that entry and scrolls to it. Declared after the effect above so it wins.
  useEffect(() => {
    const go = () => {
      if (window.location.hash.slice(1) !== entry.id) return
      setOpen(true)
      window.setTimeout(() => ref.current && ref.current.scrollIntoView({ block: 'start' }), 80)
    }
    go()
    window.addEventListener('hashchange', go)
    return () => window.removeEventListener('hashchange', go)
  }, [entry.id])

  const toggle = () => setOpen((wasOpen) => !wasOpen)
  const link = () => `${window.location.href.split(/[?#]/)[0]}#${entry.id}`

  const onCopy = async () => {
    track('copy-link')
    const ok = await copyText(link())
    setCopy(ok ? 'done' : 'manual')
    if (ok) window.setTimeout(() => setCopy('idle'), 1800)
  }

  const hasDetails = entry.details && entry.details.length > 0
  const hasMedia = entry.media && entry.media.length > 0
  const showBody = depth !== 'skim'
  const count = hasDetails ? entry.details.length : 0
  const label = entry.detailLabel || 'Technical detail'
  const columns = count >= 4 ? 'detail detail-cols' : 'detail'
  const inline = count === 1
  const hit = hits.includes(entry.id)

  const classes = ['entry', open ? 'entry-open' : '', hit ? 'entry-hit' : ''].filter(Boolean).join(' ')

  return (
    <article id={entry.id} ref={ref} className={classes}>
      <div className="entry-main">
        <div className="entry-meta">
          <Status status={entry.status} />
          <span className="entry-period">{entry.period}</span>
          <span className="entry-tools">
            {copy === 'manual' && (
              <input className="copy-input" readOnly value={link()} aria-label="Link to this entry" onFocus={(e) => e.target.select()} />
            )}
            <button type="button" className="copy-link" onClick={onCopy} title="Copy a link to this entry" aria-label={`Copy a link to ${entry.title}`}>
              <LinkIcon />
              {copy === 'done' && <span className="copy-done">Copied</span>}
            </button>
          </span>
        </div>

        <h3 className="entry-title">{entry.title}</h3>
        {entry.org && <p className="entry-org">{entry.org}</p>}

        {showBody && (
          <>
            {entry.summary && <p className="entry-summary">{entry.summary}</p>}

            {entry.tags && (
              <ul className="tags">
                {entry.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}

            {inline && (
              <p className="entry-note">
                <strong>{label}.</strong> {entry.details[0]}
              </p>
            )}

            {((hasDetails && !inline) || entry.links) && (
              <div className="entry-actions">
                {hasDetails && !inline && (
                  <button type="button" className="toggle" onClick={toggle} aria-expanded={open} aria-controls={panelId}>
                    {label}
                    <span className="toggle-count">{count}</span>
                    <span className="toggle-mark" aria-hidden="true" />
                  </button>
                )}

                {entry.links &&
                  entry.links.map((l) => (
                    <a key={l.label} className="entry-link" href={l.href}>
                      {l.label}
                    </a>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      {showBody && hasMedia && (
        <div className="entry-media">
          <Media items={entry.media} />
        </div>
      )}

      {showBody && hasDetails && !inline && (
        <div id={panelId} className={columns} hidden={!open}>
          <ul>
            {entry.details.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

export default Entry
