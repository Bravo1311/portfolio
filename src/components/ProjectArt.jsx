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

// A robot arm that scans a table, boxes the parts it detects, then picks one and drops it in the bin.
const SHOULDER = [56, 142]
const ARM_L1 = 104
const ARM_L2 = 96
const swing = (target) => {
  const dx = target[0] - SHOULDER[0]
  const dy = target[1] - SHOULDER[1]
  const d = Math.min(Math.hypot(dx, dy), ARM_L1 + ARM_L2 - 0.5)
  const a = Math.atan2(dy, dx)
  const b = Math.acos(Math.max(-1, Math.min(1, (ARM_L1 * ARM_L1 + d * d - ARM_L2 * ARM_L2) / (2 * ARM_L1 * d))))
  const th = a - b
  return {
    elbow: [SHOULDER[0] + ARM_L1 * Math.cos(th), SHOULDER[1] + ARM_L1 * Math.sin(th)],
    end: [SHOULDER[0] + d * Math.cos(a), SHOULDER[1] + d * Math.sin(a)],
  }
}

// time (s), x, y, gripper opening (1 = open)
const MOVES = [
  [0, 150, 70, 1],
  [1.6, 150, 70, 1],
  [2.5, 136, 98, 1],
  [3.3, 136, 126, 1],
  [3.8, 136, 126, 0.1],
  [4.6, 136, 96, 0.1],
  [6.1, 234, 96, 0.1],
  [6.9, 234, 118, 0.1],
  [7.4, 234, 118, 1],
  [8.3, 234, 96, 1],
  [9.4, 150, 70, 1],
  [10, 150, 70, 1],
]
const PICK_AT = 3.8
const DROP_AT = 7.4
const PARTS = [
  { x: 100, y: 142, w: 22, h: 12, round: 2 },
  { x: 172, y: 138, w: 14, h: 20, round: 6 },
]
const TARGET = { x: 136, y: 140, w: 16, h: 16, round: 2 }

const pose = (sec) => {
  let i = 0
  while (i < MOVES.length - 2 && sec > MOVES[i + 1][0]) i++
  const [t0, x0, y0, g0] = MOVES[i]
  const [t1, x1, y1, g1] = MOVES[i + 1]
  const u = ease(clamp((sec - t0) / (t1 - t0)))
  return [lerp(x0, x1, u), lerp(y0, y1, u), lerp(g0, g1, u)]
}

export const ArmArt = () => {
  const [t, ref] = useClock()
  const sec = t % 10
  const [px, py, grip] = pose(sec)
  const { elbow, end } = swing([px, py])
  const g = lerp(8.4, 12, grip)

  const scan = clamp(sec / 1.5)
  const scanX = lerp(10, 310, scan)
  const reveal = (cx) => (sec < 1.5 ? clamp((scanX - cx) / 25) : 1)
  const fade = sec > 9.3 ? 1 - clamp((sec - 9.3) / 0.7) : 1
  const sceneIn = ease(clamp(sec / 0.4))

  let obj = [TARGET.x, TARGET.y]
  if (sec >= DROP_AT) obj = [234, lerp(end[1] + 14, 140, ease(clamp((sec - DROP_AT) / 0.4)))]
  else if (sec >= PICK_AT) obj = [end[0], end[1] + 14]
  const box = (c, w, h) => [c[0] - w / 2 - 4, c[1] - h / 2 - 4, w + 8, h + 8]

  return (
    <Frame svgRef={ref} label="A robot arm detecting parts on a table and placing one in a bin">
      <line x1="14" y1="148" x2="306" y2="148" className="art-table" />
      <path d="M212,126 V148 H256 V126" className="art-bin" />
      {sec < 1.5 && <line x1={scanX} y1="30" x2={scanX} y2="148" className="art-scan" />}

      <g opacity={fade}>
        {PARTS.map((p) => (
          <g key={p.x} opacity={reveal(p.x)}>
            <rect x={p.x - p.w / 2} y={p.y - p.h / 2} width={p.w} height={p.h} rx={p.round} className="art-obj" />
            <rect x={box([p.x, p.y], p.w, p.h)[0]} y={box([p.x, p.y], p.w, p.h)[1]} width={box([p.x, p.y], p.w, p.h)[2]} height={box([p.x, p.y], p.w, p.h)[3]} className="art-box" />
          </g>
        ))}
        <g opacity={reveal(TARGET.x) * sceneIn}>
          <rect x={obj[0] - TARGET.w / 2} y={obj[1] - TARGET.h / 2} width={TARGET.w} height={TARGET.h} rx={TARGET.round} className="art-obj art-obj-target" />
          <rect x={box(obj, TARGET.w, TARGET.h)[0]} y={box(obj, TARGET.w, TARGET.h)[1]} width={box(obj, TARGET.w, TARGET.h)[2]} height={box(obj, TARGET.w, TARGET.h)[3]} className="art-box art-box-sure" />
        </g>
      </g>

      <rect x="42" y="140" width="28" height="8" rx="2" className="art-joint" />
      <line x1={SHOULDER[0]} y1={SHOULDER[1]} x2={elbow[0]} y2={elbow[1]} className="art-link2" />
      <line x1={elbow[0]} y1={elbow[1]} x2={end[0]} y2={end[1]} className="art-link2" />
      <line x1={end[0] - g} y1={end[1]} x2={end[0] + g} y2={end[1]} className="art-finger" />
      <line x1={end[0] - g} y1={end[1]} x2={end[0] - g} y2={end[1] + 9} className="art-finger" />
      <line x1={end[0] + g} y1={end[1]} x2={end[0] + g} y2={end[1] + 9} className="art-finger" />
      <circle cx={SHOULDER[0]} cy={SHOULDER[1]} r="5" className="art-joint" />
      <circle cx={elbow[0]} cy={elbow[1]} r="4.5" className="art-joint" />
    </Frame>
  )
}

export const ARTS = { 'uav-team': UavTeamArt, navigation: NavigationArt, 'flow-policy': FlowPolicyArt, perception: ArmArt }
