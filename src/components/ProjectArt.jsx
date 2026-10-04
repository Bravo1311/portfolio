import { useEffect, useRef, useState } from 'react'

// Small animated sketches shown beside a collapsed entry; the real media replaces them on expand.
// Ticks only while the returned ref's element is on screen.
export const useClock = (fps = 30) => {
  const [t, setT] = useState(0)
  const [visible, setVisible] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(2.4)
      return
    }
    if (!visible) return
    let raf
    let last = 0
    const tick = (now) => {
      if (now - last > 1000 / fps) {
        last = now
        setT(now / 1000)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [fps, visible])

  return [t, ref]
}

const lerp = (a, b, s) => a + (b - a) * s
const clamp = (v) => Math.min(1, Math.max(0, v))
const ease = (v) => v * v * (3 - 2 * v)

const Frame = ({ label, svgRef, children }) => (
  <div className="art-frame">
    <svg ref={svgRef} className="art-svg" viewBox="0 0 320 180" role="img" aria-label={label}>
      {children}
    </svg>
  </div>
)

const BASE = [
  [72, 60],
  [248, 52],
  [92, 132],
  [236, 126],
]
const LINKS = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [0, 3],
]

export const UavTeamArt = () => {
  const [t, ref] = useClock()
  const pos = BASE.map(([x, y], i) => [x + 14 * Math.cos(t * 0.7 + i * 1.7), y + 10 * Math.sin(t * 0.9 + i * 2.3)])

  return (
    <Frame svgRef={ref} label="Four drones exchanging pairwise UWB ranges">
      {BASE.map(([x, y], i) => (
        <circle key={`gt${i}`} cx={x} cy={y} r="22" className="art-ghost" />
      ))}
      {LINKS.map(([a, b], k) => {
        const [ax, ay] = pos[a]
        const [bx, by] = pos[b]
        const p = (t * 0.45 + k * 0.23) % 1
        const q = k % 2 ? 1 - p : p
        return (
          <g key={`l${k}`}>
            <line x1={ax} y1={ay} x2={bx} y2={by} className="art-link" />
            <circle cx={lerp(ax, bx, q)} cy={lerp(ay, by, q)} r="2.2" className="art-pulse" />
          </g>
        )
      })}
      {pos.map(([x, y], i) => (
        <g key={`a${i}`} transform={`translate(${x} ${y})`}>
          <circle r={13 + 3 * Math.sin(t * 1.3 + i)} className="art-halo" />
          <line x1="-8" y1="-8" x2="8" y2="8" className="art-arm" />
          <line x1="-8" y1="8" x2="8" y2="-8" className="art-arm" />
          {[
            [-8, -8],
            [8, -8],
            [-8, 8],
            [8, 8],
          ].map(([rx, ry], r) => (
            <circle key={r} cx={rx} cy={ry} r="3.4" className="art-rotor" />
          ))}
          <circle r="2.6" className="art-body" />
        </g>
      ))}
    </Frame>
  )
}

const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

const catmull = (pts, per = 24) => {
  const out = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    for (let k = 0; k < per; k++) {
      const u = k / per
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

const OBSTACLES = [
  [118, 78, 16],
  [190, 116, 18],
  [208, 54, 14],
]
const ROUTE = catmull([
  [22, 142],
  [70, 124],
  [128, 120],
  [160, 92],
  [196, 84],
  [238, 92],
  [268, 104],
])
const GOAL = ROUTE[ROUTE.length - 1]
const MARKER = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 1, 0],
]
const RAYS = 40
const RANGE = 46

const rayHit = (x, y, a) => {
  const dx = Math.cos(a)
  const dy = Math.sin(a)
  let d = RANGE
  for (const [cx, cy, r] of OBSTACLES) {
    const fx = x - cx
    const fy = y - cy
    const b = fx * dx + fy * dy
    const disc = b * b - (fx * fx + fy * fy - r * r)
    if (disc >= 0) {
      const tt = -b - Math.sqrt(disc)
      if (tt > 0 && tt < d) d = tt
    }
  }
  return [x + dx * d, y + dy * d, d < RANGE]
}

export const NavigationArt = () => {
  const [t, ref] = useClock()
  const phase = (t % 10) / 10
  const travel = ease(clamp(phase / 0.74))
  const idx = Math.round(travel * (ROUTE.length - 1))
  const [x, y] = ROUTE[idx]
  const [px, py] = ROUTE[Math.max(0, idx - 3)]
  const [nx, ny] = ROUTE[Math.min(ROUTE.length - 1, idx + 3)]
  const heading = (Math.atan2(ny - py, nx - px) * 180) / Math.PI
  const landing = clamp((phase - 0.74) / 0.12)
  const fade = phase > 0.92 ? 1 - clamp((phase - 0.92) / 0.08) : 1
  const scale = lerp(0.9, 0.55, ease(landing))
  const sweep = t * 1.2

  return (
    <Frame svgRef={ref} label="A drone flying around obstacles with LiDAR and landing on an ArUco marker">
      <g opacity={fade}>
        {OBSTACLES.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} className="art-obstacle" />
        ))}
        <polyline points={ROUTE.slice(0, idx + 1).map((q) => q.join(',')).join(' ')} className="art-trail" />
        {Array.from({ length: RAYS }, (_, i) => {
          const [hx, hy, hit] = rayHit(x, y, sweep + (i / RAYS) * Math.PI * 2)
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={hx} y2={hy} className={hit ? 'art-ray art-ray-hit' : 'art-ray'} />
              {hit && <circle cx={hx} cy={hy} r="1.6" className="art-pulse" />}
            </g>
          )
        })}
      </g>
      <g transform={`translate(${GOAL[0]} ${GOAL[1]})`}>
        <circle r={17 + 3 * Math.sin(t * 2.2)} className="art-halo" />
        <rect x="-11" y="-11" width="22" height="22" rx="2" className="art-marker" />
        {MARKER.flatMap((row, r) => row.map((on, c) => (on ? <rect key={`${r}${c}`} x={-8 + c * 5.4} y={-8 + r * 5.4} width="5" height="5" className="art-marker-cell" /> : null)))}
      </g>
      <g transform={`translate(${x} ${y}) rotate(${heading}) scale(${scale})`} opacity={fade}>
        <line x1="-8" y1="-8" x2="8" y2="8" className="art-arm" />
        <line x1="-8" y1="8" x2="8" y2="-8" className="art-arm" />
        {[
          [-8, -8],
          [8, -8],
          [-8, 8],
          [8, 8],
        ].map(([rx, ry], r) => (
          <circle key={r} cx={rx} cy={ry} r="3.4" className="art-rotor" />
        ))}
        <circle r="2.6" className="art-body" />
        <circle cx="5" r="1.1" className="art-nose" />
      </g>
    </Frame>
  )
}

const H = 14
const START = [44, 38]
const PAD = [262, 136]
const HISTORY = [
  [10, 20],
  [20, 26],
  [32, 32],
]
const STEPS = 6
const chunk = (() => {
  const r = rng(11)
  return Array.from({ length: H }, (_, i) => {
    const s = (i + 1) / H
    const sm = s * s * (3 - 2 * s)
    return {
      to: [lerp(START[0], PAD[0], s), lerp(START[1], PAD[1], sm)],
      noise: [lerp(START[0], PAD[0], s) + (r() - 0.5) * 70, lerp(START[1], PAD[1], sm) + (r() - 0.5) * 90],
    }
  })
})()

const pts = (list) => list.map((q) => q.join(',')).join(' ')

export const FlowPolicyArt = () => {
  const [t, ref] = useClock()
  const sec = t % 10
  const raw = clamp((sec - 1.2) / 5.6) * STEPS
  const k = Math.min(STEPS - 1, Math.floor(raw))
  const flow = raw >= STEPS ? 1 : (k + ease(clamp((raw - k) * 1.6))) / STEPS
  const prev = Math.max(0, flow - 1 / STEPS)
  const at = (f) => [START, ...chunk.map((c) => [lerp(c.noise[0], c.to[0], f), lerp(c.noise[1], c.to[1], f)])]
  const now = at(flow)
  const fly = ease(clamp((sec - 7.2) / 1.8))
  const fi = fly * (now.length - 1)
  const a = now[Math.floor(fi)]
  const b = now[Math.min(now.length - 1, Math.floor(fi) + 1)]
  const dx = lerp(a[0], b[0], fi % 1)
  const dy = lerp(a[1], b[1], fi % 1)
  const fade = sec > 9.2 ? 1 - clamp((sec - 9.2) / 0.8) : 1

  return (
    <Frame svgRef={ref} label="A noisy action chunk refined step by step into a landing trajectory">
      <g opacity={fade}>
        <polyline points={pts(HISTORY.concat([START]))} className="art-trail" />
        {HISTORY.map(([hx, hy], i) => (
          <circle key={i} cx={hx} cy={hy} r="2" className="art-hist" />
        ))}
        {flow > 0 && flow < 1 && <polyline points={pts(at(prev))} className="art-ghost-line" />}
        <polyline points={pts(now)} className="art-chunk" style={{ opacity: 0.35 + 0.65 * flow }} />
        {now.slice(1).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={lerp(1.8, 2.5, flow)} className={flow > 0.98 ? 'art-dot' : 'art-hist'} />
        ))}
        <g transform={`translate(${START[0] + (dx - START[0]) * (fly > 0 ? 1 : 0)} ${fly > 0 ? dy : START[1]})`}>
          <circle r="6" className="art-halo" />
          <circle r="3.2" className="art-body" />
        </g>
      </g>
      <g transform={`translate(${PAD[0]} ${PAD[1]})`}>
        <circle r="14" className="art-pad" />
        <path d="M-5 -6V6M5 -6V6M-5 0H5" className="art-pad-mark" />
      </g>
      <line x1="40" y1="168" x2="280" y2="168" className="art-bar" />
      <line x1="40" y1="168" x2={40 + 240 * flow} y2="168" className="art-bar-fill" />
    </Frame>
  )
}

export const ARTS = { 'uav-team': UavTeamArt, navigation: NavigationArt, 'flow-policy': FlowPolicyArt }
