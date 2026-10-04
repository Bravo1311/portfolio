// Site-level switches. Everything here is optional.

const parse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const site = {
  // Cookie-free visit statistics, OFF by default. To switch on, either fill this in or set
  // VITE_ANALYTICS when building, for example:
  //   {"provider":"goatcounter","endpoint":"https://YOURCODE.goatcounter.com/count"}
  //   {"provider":"plausible","domain":"yourdomain.com"}
  // Visitors who send "Do Not Track" are never counted.
  analytics: parse(import.meta.env.VITE_ANALYTICS),

  // true: YouTube videos play inside the page. false: the poster opens YouTube in a new tab.
  // A video you host yourself (see README) never involves YouTube at all.
  embedYouTube: true,
}
