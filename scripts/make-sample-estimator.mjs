// Writes src/data/estimator.json with SYNTHETIC placeholder data (flagged "illustrative").
// Replace it with real output: see scripts/estimator-from-csv.mjs and the README.
import fs from 'fs'

const rng = (seed) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const r = rng(42)
const gauss = () => {
  let u = 0
  let v = 0
  while (!u) u = r()
  while (!v) v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

const T = 120
const DT = 0.5
const n = Math.round(T / DT) + 1
const t = []
const truth = []
const estimate = []
const dr = []
const raw = []
let ex = 0
let ey = 0
for (let i = 0; i < n; i++) {
  const s = i * DT
  const x = 70 * Math.sin((2 * Math.PI * s) / 110)
  const y = 40 * Math.sin((4 * Math.PI * s) / 110)
  ex = 0.9 * ex + 0.122 * gauss()
  ey = 0.9 * ey + 0.122 * gauss()
  t.push(+s.toFixed(1))
  truth.push([+x.toFixed(2), +y.toFixed(2)])
  raw.push([ex, ey])
  dr.push([+(x + 0.0045 * s * s).toFixed(2), +(y - 0.003 * s * s).toFixed(2)])
}

// Scale the error so the sample's position RMSE is exactly the figure quoted on the page.
const TARGET_RMSE = 0.3
const rawRmse = Math.sqrt(raw.reduce((sum, [a, b]) => sum + a * a + b * b, 0) / n)
const k = TARGET_RMSE / rawRmse
raw.forEach(([a, b], i) => estimate.push([+(truth[i][0] + a * k).toFixed(2), +(truth[i][1] + b * k).toFixed(2)]))
const rmse = Math.sqrt(estimate.reduce((sum, e, i) => sum + Math.hypot(e[0] - truth[i][0], e[1] - truth[i][1]) ** 2, 0) / n)
console.log('sample position RMSE', rmse.toFixed(3), 'm')

const out = {
  meta: {
    label: 'Sample data',
    illustrative: true,
    units: 'm',
    source: 'Synthetic placeholder from scripts/make-sample-estimator.mjs. Replace with real estimator output.',
  },
  t,
  truth,
  estimate,
  dr,
}
fs.mkdirSync('src/data', { recursive: true })
fs.writeFileSync('src/data/estimator.json', JSON.stringify(out))
console.log('wrote src/data/estimator.json with', n, 'synthetic samples')
