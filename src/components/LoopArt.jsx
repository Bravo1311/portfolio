import { useClock } from './ProjectArt.jsx'

// The hero's chain closed into a ring, with the planned link back into estimation drawn across it.
const CX = 230
const CY = 178
const R = 116
const GAP = 11

const STAGES = [
  { label: 'Sensing', deg: -90, own: false, side: 'top' },
  { label: 'Estimation', deg: -18, own: true, side: 'right' },
  { label: 'Integration', deg: 54, own: true, side: 'right' },
  { label: 'Policy', deg: 126, own: true, side: 'left' },
  { label: 'Action', deg: 198, own: false, side: 'left' },
]

const rad = (deg) => (deg * Math.PI) / 180
const pt = (deg, r = R) => [CX + r * Math.cos(rad(deg)), CY + r * Math.sin(rad(deg))]
const arc = (a0, a1) => {
  const [x0, y0] = pt(a0 + GAP)
  const [x1, y1] = pt(a1 - GAP)
  return `M${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`
}
const toward = ([x, y], [tx, ty], by) => {
  const d = Math.hypot(tx - x, ty - y)
  return [x + ((tx - x) / d) * by, y + ((ty - y) / d) * by]
}
const angDist = (a, b) => Math.abs(((a - b + 540) % 360) - 180)

const policy = pt(126)
const estimation = pt(-18)
const A = toward(policy, estimation, 14)
const B = toward(estimation, policy, 14)

const LoopArt = () => {
  const [t, ref] = useClock()
  const lead = -90 + ((t * 27.7) % 360)

  return (
    <svg ref={ref} className="loop-svg" viewBox="60 36 400 262" role="img" aria-label="The autonomy chain closed into a loop, with a planned link back into estimation">
      <defs>
        <marker id="loop-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8z" className="loop-head" />
        </marker>
        <marker id="loop-arrow-hot" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L8 4L0 8z" className="loop-head-hot" />
        </marker>
      </defs>

      {STAGES.map((s, i) => (
        <path key={s.label} d={arc(s.deg, i === STAGES.length - 1 ? 270 : STAGES[i + 1].deg)} className="loop-edge" markerEnd="url(#loop-arrow)" />
      ))}

      <path d={`M${A.join(',')} L${B.join(',')}`} className="loop-planned" markerEnd="url(#loop-arrow-hot)" />
      <text x={CX + 6} y={CY + 22} textAnchor="middle" className="loop-label loop-label-hot">relative pose</text>

      {Array.from({ length: 8 }, (_, j) => {
        const [x, y] = pt(lead - j * 4.2)
        return <circle key={j} cx={x} cy={y} r={3.4 - j * 0.38} className="loop-dot" style={{ opacity: 1 - j * 0.12 }} />
      })}

      {STAGES.map((s) => {
        const [x, y] = pt(s.deg)
        const glow = Math.max(0, 1 - angDist(lead, s.deg) / 14)
        const tx = s.side === 'right' ? x + 18 : s.side === 'left' ? x - 18 : x
        const anchor = s.side === 'right' ? 'start' : s.side === 'left' ? 'end' : 'middle'
        const ty = s.side === 'top' ? y - 16 : y + 5
        return (
          <g key={s.label}>
            <circle cx={x} cy={y} r={7 + 9 * glow} className={s.own ? 'loop-halo' : 'loop-halo loop-halo-edge'} style={{ opacity: 0.16 + 0.6 * glow }} />
            <circle cx={x} cy={y} r={s.own ? 7 : 6} className={s.own ? 'loop-node-own' : 'loop-node-edge'} />
            <text x={tx} y={ty} textAnchor={anchor} className={s.own ? 'loop-title' : 'loop-title loop-title-edge'}>{s.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default LoopArt
