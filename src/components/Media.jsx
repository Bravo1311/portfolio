import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import EstimatorPlot from './EstimatorPlot.jsx'
import estimator from '../data/estimator.json'
import { site } from '../config.js'
import { track } from '../lib/analytics.js'

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
)

// A video is either on YouTube (videoId) or a file you host yourself (src), which never involves YouTube.
const isYouTube = (item) => item.kind === 'video' && Boolean(item.videoId)
const isHosted = (item) => item.kind === 'video' && Boolean(item.src)
const isVideo = (item) => isYouTube(item) || isHosted(item)
const watchUrl = (item) => `https://youtu.be/${item.videoId}`

// A visible stand-in so empty slots look intentional, and are obviously not real evidence.
const Placeholder = ({ label }) => (
  <div className="ph">
    <span className="ph-badge">Placeholder</span>
    <span className="ph-label">{label}</span>
  </div>
)

// YouTube's real thumbnail where the page may load it; a drawn poster underneath where it may not.
const Thumbnail = ({ item }) => {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  if (isHosted(item) && item.poster) return <img src={item.poster} alt="" loading="lazy" onError={() => setFailed(true)} />
  if (item.kind === 'image' && item.src) return <img src={item.src} alt="" loading="lazy" onError={() => setFailed(true)} />
  if (!isYouTube(item)) return null
  return (
    <img
      src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

// Nothing is requested from YouTube until the visitor presses play.
const Poster = ({ item, onPlay, linkOut }) => {
  const inner = (
    <>
      <Thumbnail item={item} />
      <span className="poster-play">
        <PlayIcon />
      </span>
      <span className="poster-title">{item.title}</span>
      {linkOut && item.blocked && (
        <span className="poster-note">This page cannot embed the player here. Opens YouTube instead.</span>
      )}
    </>
  )

  return linkOut ? (
    <a className="poster" href={watchUrl(item)} target="_blank" rel="noopener noreferrer" onClick={() => track('video-play')}>
      {inner}
    </a>
  ) : (
    <button type="button" className="poster" onClick={onPlay} aria-label={`Play: ${item.title}`}>
      {inner}
    </button>
  )
}

const Player = ({ item, onBlocked }) => {
  // If the host page forbids embedding, the browser reports it; fall back to a link.
  useEffect(() => {
    const onViolation = (event) => {
      if (/youtube/i.test(event.blockedURI || '')) onBlocked()
    }
    document.addEventListener('securitypolicyviolation', onViolation)
    return () => document.removeEventListener('securitypolicyviolation', onViolation)
  }, [onBlocked])

  return (
    <iframe
      className="player"
      src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
      title={item.title}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  )
}

const Lead = ({ item, playing, blocked, onPlay, onBlocked }) => {
  if (item.kind === 'plot') return <EstimatorPlot />

  if (isHosted(item)) {
    return (
      <video
        className="media-video"
        src={item.src}
        poster={item.poster}
        controls
        playsInline
        preload="metadata"
        onPlay={() => track('video-play')}
      />
    )
  }

  if (isYouTube(item)) {
    const linkOut = blocked || item.embed === false || !site.embedYouTube
    if (playing && !linkOut) return <Player item={item} onBlocked={onBlocked} />
    return <Poster item={{ ...item, blocked }} onPlay={() => { track('video-play'); onPlay() }} linkOut={linkOut} />
  }

  if (item.src) return <img className="media-img" src={item.src} alt={item.alt || item.caption || ''} />
  return <Placeholder label={item.label || 'Add an image or GIF'} />
}

const thumbName = (item) => item.title || item.caption || 'Item'

// the chart's caption changes honestly with the data: sample data says so
const captionFor = (item) =>
  item.kind === 'plot' && estimator.meta.illustrative
    ? 'Illustrative sample data: ground truth, a drifting dead-reckoned track and a fused estimate. Hover or tap to inspect.'
    : item.caption

const canEnlarge = (item) => item.kind === 'plot' || isVideo(item) || Boolean(item.src)

const Glyph = ({ d }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
)
const EXPAND = 'M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7'
const CLOSE = 'M6 6l12 12M18 6 6 18'
const PREV = 'M15 5l-7 7 7 7'
const NEXT = 'M9 5l7 7-7 7'

const FOCUSABLE = 'button, a[href], iframe, video[controls], [tabindex]:not([tabindex="-1"])'

// A full-screen viewer for whichever item is active. Rendered in a portal so no ancestor's transform can trap it.
const Lightbox = ({ items, active, setActive, onClose }) => {
  const [blocked, setBlocked] = useState(false)
  const dialog = useRef(null)
  const closeBtn = useRef(null)
  const item = items[active]
  const many = items.length > 1

  useEffect(() => {
    const before = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current && closeBtn.current.focus()

    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') setActive((i) => (i + 1) % items.length)
      else if (event.key === 'ArrowLeft') setActive((i) => (i - 1 + items.length) % items.length)
      else if (event.key === 'Tab' && dialog.current) {
        const nodes = [...dialog.current.querySelectorAll(FOCUSABLE)]
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      before && before.focus && before.focus()
    }
  }, [items.length, onClose, setActive])

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={thumbName(item)} ref={dialog} onClick={onClose}>
      <button type="button" className="lightbox-btn lightbox-close" ref={closeBtn} onClick={onClose} aria-label="Close">
        <Glyph d={CLOSE} />
      </button>
      {many && (
        <button type="button" className="lightbox-btn lightbox-prev" onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + items.length) % items.length) }} aria-label="Previous">
          <Glyph d={PREV} />
        </button>
      )}
      {many && (
        <button type="button" className="lightbox-btn lightbox-next" onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % items.length) }} aria-label="Next">
          <Glyph d={NEXT} />
        </button>
      )}
      <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
        <div className="media-frame lightbox-frame">
          <Lead key={active} item={item} playing blocked={blocked} onPlay={() => {}} onBlocked={() => setBlocked(true)} />
        </div>
        <p className="lightbox-caption">{captionFor(item)}</p>
      </div>
    </div>,
    document.body,
  )
}

// One large frame; with several items, a strip below swaps which one is shown.
const Media = ({ items }) => {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const item = items[active]

  const pick = (index) => {
    setActive(index)
    setPlaying(isYouTube(items[index]))
  }

  const caption = captionFor(item)

  const enlarge = () => {
    track('media-enlarge')
    setPlaying(false)
    setExpanded(true)
  }

  return (
    <div className="media">
      <figure className="media-fig">
        <div className="media-frame">
          {!expanded && (
            <Lead
              key={active}
              item={item}
              playing={playing}
              blocked={blocked}
              onPlay={() => setPlaying(true)}
              onBlocked={() => setBlocked(true)}
            />
          )}
        </div>
        <figcaption>
          {caption}
          {isYouTube(item) && (
            <>
              {' '}
              <a href={watchUrl(item)} target="_blank" rel="noopener noreferrer">
                Open on YouTube
              </a>
            </>
          )}
        </figcaption>
        {canEnlarge(item) && (
          <button type="button" className="media-enlarge" onClick={enlarge} aria-label={`Enlarge: ${thumbName(item)}`}>
            <Glyph d={EXPAND} />
            Enlarge
          </button>
        )}
      </figure>

      {expanded && <Lightbox items={items} active={active} setActive={setActive} onClose={() => setExpanded(false)} />}

      {items.length > 1 && (
        <ul className="thumbs" style={{ '--n': items.length }}>
          {items.map((it, i) => (
            <li key={thumbName(it)}>
              <button
                type="button"
                className={i === active ? 'thumb thumb-on' : 'thumb'}
                onClick={() => pick(i)}
                aria-pressed={i === active}
                aria-label={`Show: ${thumbName(it)}`}
              >
                <span className={isVideo(it) ? 'thumb-frame thumb-video' : 'thumb-frame thumb-empty'}>
                  <Thumbnail item={it} />
                  {isVideo(it) && (
                    <span className="thumb-play">
                      <PlayIcon />
                    </span>
                  )}
                </span>
                <span className="thumb-title">{thumbName(it)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Media
