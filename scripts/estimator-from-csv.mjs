// Turns real estimator output into src/data/estimator.json.
//
//   node scripts/estimator-from-csv.mjs run.csv --label "Thesis run 12" --source "GTSAM FGO vs simulated ground truth"
//
// CSV header (extra columns are ignored; dr_x, dr_y are optional):
//   t,truth_x,truth_y,est_x,est_y,dr_x,dr_y
// Positions in metres in one common frame. Downsampled to at most 500 rows.
import fs from 'fs'

const args = process.argv.slice(2)
const file = args[0]
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i > -1 ? args[i + 1] : fallback
}
if (!file) {
  console.error('usage: node scripts/estimator-from-csv.mjs run.csv [--label "..."] [--source "..."]')
  process.exit(1)
}

const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/)
const head = lines[0].split(',').map((h) => h.trim())
const col = (name) => head.indexOf(name)
const need = ['t', 'truth_x', 'truth_y', 'est_x', 'est_y']
const missing = need.filter((c) => col(c) < 0)
if (missing.length) {
  console.error('missing columns:', missing.join(', '))
  process.exit(1)
}
const hasDr = col('dr_x') > -1 && col('dr_y') > -1

let rows = lines.slice(1).map((l) => l.split(',').map(Number)).filter((r) => r.every((v) => Number.isFinite(v) || true))
const step = Math.max(1, Math.ceil(rows.length / 500))
rows = rows.filter((_, i) => i % step === 0)
const get = (r, c) => r[col(c)]
const t0 = get(rows[0], 't')
const round = (v, k = 3) => +v.toFixed(k)

const out = {
  meta: {
    label: opt('label', 'Estimator run'),
    illustrative: false,
    units: 'm',
    source: opt('source', file),
  },
  t: rows.map((r) => round(get(r, 't') - t0, 2)),
  truth: rows.map((r) => [round(get(r, 'truth_x')), round(get(r, 'truth_y'))]),
  estimate: rows.map((r) => [round(get(r, 'est_x')), round(get(r, 'est_y'))]),
}
if (hasDr) out.dr = rows.map((r) => [round(get(r, 'dr_x')), round(get(r, 'dr_y'))])

fs.mkdirSync('src/data', { recursive: true })
fs.writeFileSync('src/data/estimator.json', JSON.stringify(out))
const err = out.estimate.map((e, i) => Math.hypot(e[0] - out.truth[i][0], e[1] - out.truth[i][1]))
const rmse = Math.sqrt(err.reduce((s, x) => s + x * x, 0) / err.length)
console.log(`wrote src/data/estimator.json: ${rows.length} samples, position RMSE ${rmse.toFixed(3)} m`)
console.log('The page computes the same RMSE from these rows, so any number you quote will match what visitors see.')
