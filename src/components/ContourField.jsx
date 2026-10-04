import { contours } from 'd3-contour'

// Decorative terrain: contour lines of a made-up landscape with a route across it.
// It is a chart-style illustration, not data, and says nothing about any real terrain.
const W = 120
const H = 90

const PEAKS = [
  { x: 28, y: 30, r: 20, h: 1.0 },
  { x: 78, y: 22, r: 17, h: 0.85 },
  { x: 92, y: 64, r: 22, h: 1.0 },
  { x: 42, y: 70, r: 16, h: 0.7 },
  { x: 62, y: 46, r: 12, h: 0.5 },
]

const field = () => {
  const values = new Array(W * H)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let v = 0
      for (const p of PEAKS) {
        const d2 = (x - p.x) ** 2 + (y - p.y) ** 2
        v += p.h * Math.exp(-d2 / (2 * p.r * p.r))
      }
      values[y * W + x] = v + 0.04 * Math.sin(x * 0.35) * Math.cos(y * 0.3)
    }
  }
  return values
}

const toPath = (multiPolygon) =>
  multiPolygon.coordinates
    .map((polygon) =>
      polygon.map((ring) => 'M' + ring.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L') + 'Z').join(''),
    )
    .join('')

const LEVELS = Array.from({ length: 22 }, (_, i) => 0.08 + i * 0.07)
const LINES = contours().size([W, H]).thresholds(LEVELS)(field())

const FLOWN = [[8, 74], [30, 56], [52, 60], [66, 38], [88, 40], [110, 14]]
// A route that comes back toward where it started: the loop being closed.
const PLANNED = [[40, 66], [24, 46], [40, 24], [70, 18], [94, 34], [90, 58], [66, 68], [44, 58]]

const smooth = (pts) => {
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`
  }
  return d
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ROTORS = [[-2.3, -2.3], [2.3, -2.3], [-2.3, 2.3], [2.3, 2.3]]

// A top-down quadrotor drawn like a chart symbol, nose pointing along +x.
// With `live`, the rotors spin and the whole aircraft breathes slightly, like a hover.
const Quadrotor = ({ live }) => (
  <g className="drone">
    {live && (
      <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="2.6s" repeatCount="indefinite" />
    )}
    <path d="M-2.3,-2.3L2.3,2.3M-2.3,2.3L2.3,-2.3" className="drone-arm" />
    {ROTORS.map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={1.45} className="drone-rotor" />
        <path d={`M${x - 1.15},${y}L${x + 1.15},${y}`} className="drone-blade">
          {live && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${i % 2 ? 360 : 0} ${x} ${y}`}
              to={`${i % 2 ? 0 : 360} ${x} ${y}`}
              dur="0.45s"
              repeatCount="indefinite"
            />
          )}
        </path>
      </g>
    ))}
    <circle r={1} className="drone-body" />
    <path d="M1.3,-0.55L2.1,0L1.3,0.55Z" className="drone-nose" />
  </g>
)

const Terrain = () => (
  <g className="contour-lines">
    {LINES.map((line, i) => (
      <path key={line.value} d={toPath(line)} className={i % 5 === 0 ? 'contour-index' : 'contour-minor'} />
    ))}
  </g>
)

// variant "flown": solid path drawn once, a quadrotor flies it. variant "planned": dashed, still.
const ContourField = ({ variant = 'flown' }) => {
  if (variant === 'planned') {
    return (
      <svg className="contour" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <Terrain />
        <path d={smooth(PLANNED)} className="contour-planned" />
        {PLANNED.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.1} className="contour-wp-planned" />
        ))}
      </svg>
    )
  }

  const still = prefersReducedMotion()
  return (
    <svg className="contour" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Terrain />
      <path id="flight-path" d={smooth(FLOWN)} className="contour-path" pathLength="1" />
      {FLOWN.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 || i === FLOWN.length - 1 ? 1.7 : 1.1} className="contour-wp" style={{ '--i': i }} />
      ))}
      {still ? (
        <g transform="translate(88 40) rotate(5)">
          <Quadrotor />
        </g>
      ) : (
        <g opacity="0">
          {/* One 11.5 s cycle, repeated for good: take off at the start, fly the route for 9.1 s,
              fade out at the end, rest briefly, begin again. */}
          <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.04;0.74;0.8;1" dur="11.5s" begin="3.7s" repeatCount="indefinite" />
          <animateMotion
            dur="11.5s"
            begin="3.7s"
            repeatCount="indefinite"
            rotate="auto"
            calcMode="spline"
            keyPoints="0;1;1"
            keyTimes="0;0.79;1"
            keySplines="0.45 0 0.25 1; 0 0 1 1"
          >
            <mpath href="#flight-path" />
          </animateMotion>
          <Quadrotor live />
        </g>
      )}
    </svg>
  )
}

export default ContourField
