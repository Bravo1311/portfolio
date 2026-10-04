import { useEffect, useId, useRef, useState } from 'react'
import Status from './Status.jsx'
import Media from './Media.jsx'
import { ARTS } from './ProjectArt.jsx'
import { useEvidence } from './EvidenceContext.jsx'
import { copyText } from '../lib/clipboard.js'
import { track } from '../lib/analytics.js'

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
)

const Collapse = ({ open, id, className = '', children }) => (
  <div id={id} className={`collapse ${open ? 'collapse-open' : ''} ${className}`.trim()} aria-hidden={!open} inert={open ? undefined : ''}>
    <div className="collapse-inner">{children}</div>
  </div>
)

const Entry = ({ entry }) => {
  const { hits } = useEvidence()
  const [open, setOpen] = useState(false)
  const [copy, setCopy] = useState('idle') // idle | done | manual
  const revealId = useId()
  const mediaId = useId()
  const detailId = useId()
  const ref = useRef(null)

  // A link such as #thesis-fgo opens that entry and scrolls to it.
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

  const toggle = () =>
    setOpen((wasOpen) => {
      const next = !wasOpen
      if (next) track('entry-toggle')
      return next
    })
  const link = () => `${window.location.href.split(/[?#]/)[0]}#${entry.id}`

  const onCopy = async () => {
    track('copy-link')
    const ok = await copyText(link())
    setCopy(ok ? 'done' : 'manual')
    if (ok) window.setTimeout(() => setCopy('idle'), 1800)
  }

  const hasTags = entry.tags && entry.tags.length > 0
  const hasDetails = entry.details && entry.details.length > 0
  const hasMedia = entry.media && entry.media.length > 0
  const hasLinks = entry.links && entry.links.length > 0
  const Art = entry.art && ARTS[entry.art]
  const showMedia = hasMedia && (open || !Art)
  const count = hasDetails ? entry.details.length : 0
  const label = entry.detailLabel || 'Details'
  const columns = count >= 4 ? 'detail detail-cols' : 'detail'
  const inline = count === 1
  const hasHidden = hasTags || hasDetails || hasMedia || hasLinks
  const hit = hits.includes(entry.id)

  const classes = ['entry', open ? 'entry-open' : '', hit ? 'entry-hit' : ''].filter(Boolean).join(' ')
  const controls = [revealId, (hasMedia || Art) && mediaId, hasDetails && !inline && detailId].filter(Boolean).join(' ')

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
        {entry.summary && <p className="entry-summary">{entry.summary}</p>}

        {hasHidden && (
          <button type="button" className="toggle" onClick={toggle} aria-expanded={open} aria-controls={controls}>
            {open ? 'Hide details' : 'Show details'}
            {count > 0 && <span className="toggle-count">{count}</span>}
            <span className="toggle-mark" aria-hidden="true" />
          </button>
        )}

        <Collapse open={open} id={revealId} className="entry-reveal">
          {hasTags && (
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

          {hasLinks && (
            <div className="entry-actions">
              {entry.links.map((l) => (
                <a key={l.label} className="entry-link" href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </Collapse>
      </div>

      {(hasMedia || Art) && (
        <div className="entry-media" id={mediaId} hidden={!open && !Art}>
          <div key={showMedia ? 'media' : 'art'} className={showMedia ? 'swap' : 'swap art-click'} onClick={showMedia ? undefined : toggle}>
            {showMedia ? <Media items={entry.media} /> : <Art />}
          </div>
        </div>
      )}

      {hasDetails && !inline && (
        <Collapse open={open} id={detailId} className="detail-wrap">
          <div className="detail-pad">
            <div className={columns}>
              <p className="detail-title">{label}</p>
              <ul>
                {entry.details.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </Collapse>
      )}
    </article>
  )
}

export default Entry
