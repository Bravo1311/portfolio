import { useRef, useState } from 'react'
import estimator from '../data/estimator.json'
import { useReveal } from '../hooks.js'

// Draws src/data/estimator.json: the path, and the error over time. RMSE is computed here from
// the rows, so the number shown always matches the data. Hover or tap to inspect a moment.

const W = 400
const H = 225
const M = { l: 34, r: 14, t: 46, b: 46 }

const niceCeil = (v) => {
  const p = 10 ** Math.floor(Math.log10(v || 1))
  const m = v / p
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p
}
const trim = (v) => (v >= 10 ? Math.round(v) : +v.toFixed(2))

const build = (d) => {
  const n = d.t.length
  const hasDr = Array.isArray(d.dr) && d.dr.length === n
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
  const err = d.estimate.map((e, i) => dist(e, d.truth[i]))
  const drErr = hasDr ? d.dr.map((e, i) => dist(e, d.truth[i])) : null
  const rmse = Math.sqrt(err.reduce((s, x) => s + x * x, 0) / n)

  const all = [...d.truth, ...d.estimate, ...(hasDr ? d.dr : [])]
  const xs = all.map((p) => p[0])
  const ys = all.map((p) => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const bw = W - M.l - M.r
  const bh = H - M.t - M.b
  const s = Math.min(bw / (maxX - minX || 1), bh / (maxY - minY || 1))
  const ox = M.l + (bw - s * (maxX - minX)) / 2
  const oy = M.t + (bh - s * (maxY - minY)) / 2
  const P = (p) => [ox + (p[0] - minX) * s, oy + (maxY - p[1]) * s]
  const path = (pts) => 'M' + pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join('L')

  const tmax = d.t[n - 1] || 1
  const ytop = niceCeil(Math.max(...err) * 1.25)
  const E = (i, e) => [M.l + (d.t[i] / tmax) * bw, M.t + bh - (Math.min(e, ytop * 1.05) / ytop) * bh]

  return {
    n, bw, bh, tmax, ytop, rmse, err, hasDr, P, E,
    truthPath: path(d.truth.map(P)),
    estPath: path(d.estimate.map(P)),
    drPath: hasDr ? path(d.dr.map(P)) : '',
    errPath: path(err.map((e, i) => E(i, e))),
    drErrPath: hasDr ? path(drErr.map((e, i) => E(i, e))) : '',
  }
}
const MODEL = build(estimator)

const EstimatorPlot = () => {
  const reveal = useReveal()
  const live = reveal.className.includes('reveal-on')
  const [view, setView] = useState('path')
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)
  const { meta } = estimator
  const m = MODEL

  const local = (event) => {
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY
    return pt.matrixTransform(svg.getScreenCTM().inverse())
  }

  const onMove = (event) => {
    const p = local(event)
    if (view === 'path') {
      let best = 0
      let bd = Infinity
      for (let i = 0; i < m.n; i++) {
        const q = m.P(estimator.truth[i])
        const d = (q[0] - p.x) ** 2 + (q[1] - p.y) ** 2
        if (d < bd) {
          bd = d
          best = i
        }
      }
      setHover(best)
    } else {
      setHover(Math.max(0, Math.min(m.n - 1, Math.round(((p.x - M.l) / m.bw) * (m.n - 1)))))
    }
  }

  const stats =
    hover === null
      ? `${meta.illustrative ? 'Sample · ' : ''}RMSE ${m.rmse.toFixed(2)} m`
      : `t ${estimator.t[hover].toFixed(1)} s · error ${m.err[hover].toFixed(2)} m`

  return (
    <div ref={reveal.ref} className={live ? 'ep ep-on' : 'ep'}>
      <svg
        ref={svgRef}
        className="ep-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${meta.label}: estimator ${view === 'path' ? 'path against ground truth' : 'error over time'}. Position RMSE ${m.rmse.toFixed(2)} metres.`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <clipPath id="ep-clip">
            <rect x={M.l} y={M.t} width={m.bw} height={m.bh} />
          </clipPath>
        </defs>

        {view === 'path' ? (
          <g>
            <rect x={M.l} y={M.t} width={m.bw} height={m.bh} className="ep-frame" />
            <path d={m.truthPath} className="ep-truth" clipPath="url(#ep-clip)" />
            {m.hasDr && <path d={m.drPath} className="ep-dr" clipPath="url(#ep-clip)" />}
            <path d={m.estPath} className="ep-est" pathLength="1" />
            {hover !== null && (() => {
              const a = m.P(estimator.truth[hover])
              const b = m.P(estimator.estimate[hover])
              return (
                <g>
                  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="ep-link" />
                  <circle cx={a[0]} cy={a[1]} r="3.4" className="ep-pt-truth" />
                  <circle cx={b[0]} cy={b[1]} r="3" className="ep-pt-est" />
                </g>
              )
            })()}
          </g>
        ) : (
          <g>
            <rect x={M.l} y={M.t} width={m.bw} height={m.bh} className="ep-frame" />
            {[0, 0.5, 1].map((f) => (
              <g key={f}>
                <line x1={M.l} x2={M.l + m.bw} y1={M.t + m.bh * (1 - f)} y2={M.t + m.bh * (1 - f)} className="ep-grid" />
                <text x={M.l - 5} y={M.t + m.bh * (1 - f) + 3} className="ep-tick" textAnchor="end">
                  {trim(m.ytop * f)}
                </text>
              </g>
            ))}
            {[0, 0.5, 1].map((f) => (
              <text key={f} x={M.l + m.bw * f} y={M.t + m.bh + 13} className="ep-tick" textAnchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}>
                {Math.round(m.tmax * f)} s
              </text>
            ))}
            <text x={6} y={M.t - 6} className="ep-tick">error, m</text>
            {m.hasDr && <path d={m.drErrPath} className="ep-dr" clipPath="url(#ep-clip)" />}
            <line x1={M.l} x2={M.l + m.bw} y1={m.E(0, m.rmse)[1]} y2={m.E(0, m.rmse)[1]} className="ep-rmse" />
            <path d={m.errPath} className="ep-est" pathLength="1" />
            {hover !== null && (() => {
              const q = m.E(hover, m.err[hover])
              return (
                <g>
                  <line x1={q[0]} x2={q[0]} y1={M.t} y2={M.t + m.bh} className="ep-cursor" />
                  <circle cx={q[0]} cy={q[1]} r="3" className="ep-pt-est" />
                </g>
              )
            })()}
          </g>
        )}
      </svg>

      <ul className="ep-legend">
        <li className="lg-truth">ground truth</li>
        <li className="lg-fused">estimate</li>
        {m.hasDr && <li className="lg-drift">dead reckoning</li>}
      </ul>
      {meta.illustrative && <span className="ph-badge ph-corner">Illustrative</span>}

      <div className="ep-tabs" role="group" aria-label="Chart view">
        {[
          ['path', 'Path'],
          ['error', 'Error'],
        ].map(([id, label]) => (
          <button key={id} type="button" className={view === id ? 'ep-tab ep-tab-on' : 'ep-tab'} aria-pressed={view === id} onClick={() => { setView(id); setHover(null) }}>
            {label}
          </button>
        ))}
      </div>
      <p className="ep-stats" aria-live="polite">{stats}</p>
    </div>
  )
}

export default EstimatorPlot
