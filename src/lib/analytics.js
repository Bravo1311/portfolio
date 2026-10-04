import { site } from '../config.js'

let started = false

const doNotTrack = () =>
  typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || window.doNotTrack === '1')

export const analyticsOn = () => Boolean(site.analytics) && !doNotTrack()

export const initAnalytics = () => {
  if (started || !analyticsOn()) return
  const cfg = site.analytics
  const script = document.createElement('script')
  script.async = true
  if (cfg.provider === 'goatcounter' && cfg.endpoint) {
    script.src = 'https://gc.zgo.at/count.js'
    script.dataset.goatcounter = cfg.endpoint
  } else if (cfg.provider === 'plausible' && cfg.domain) {
    script.defer = true
    script.src = 'https://plausible.io/js/script.js'
    script.dataset.domain = cfg.domain
  } else {
    return
  }
  document.head.appendChild(script)
  started = true
}

// Named events such as "video-play" or "copy-link". A no-op unless analytics is on.
export const track = (name) => {
  if (!started) return
  try {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: `event/${name}`, title: name, event: true })
    } else if (window.plausible) {
      window.plausible(name)
    }
  } catch {
    // never let measurement break the page
  }
}
