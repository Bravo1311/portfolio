import { useEffect, useState } from 'react'
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

// One large frame; with several items, a strip below swaps which one is shown.
const Media = ({ items }) => {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const item = items[active]

  const pick = (index) => {
    setActive(index)
    setPlaying(isYouTube(items[index]))
  }

  // the chart's caption changes honestly with the data: sample data says so
  const caption =
    item.kind === 'plot' && estimator.meta.illustrative
      ? 'Illustrative sample data: ground truth, a drifting dead-reckoned track and a fused estimate. Hover or tap to inspect.'
      : item.caption

  return (
    <div className="media">
      <figure className="media-fig">
        <div className="media-frame">
          <Lead
            key={active}
            item={item}
            playing={playing}
            blocked={blocked}
            onPlay={() => setPlaying(true)}
            onBlocked={() => setBlocked(true)}
          />
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
      </figure>

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
