// Renders the built page through its print stylesheet into exports/site-print.pdf.
// It never touches public/Kartik_Agrawal_CV.pdf, which is the hand-made CV the site links to.
// Needs Chrome or Chromium installed.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const page = resolve('dist/index.html')
const out = resolve('exports/site-print.pdf')
mkdirSync(dirname(out), { recursive: true })
if (!existsSync(page)) {
  console.error('dist/index.html is missing. Run `npm run build` first.')
  process.exit(1)
}

const candidates = [process.env.CHROME_PATH, 'google-chrome', 'chromium', 'chromium-browser', 'chrome'].filter(Boolean)
const chrome = candidates.find((name) => spawnSync(name, ['--version'], { stdio: 'ignore' }).status === 0)
if (!chrome) {
  console.error('No Chrome or Chromium found. Set CHROME_PATH to its location.')
  process.exit(1)
}

const run = spawnSync(
  chrome,
  ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', '--virtual-time-budget=8000', `--print-to-pdf=${out}`, pathToFileURL(page).href],
  { stdio: 'inherit' },
)
if (run.status !== 0) process.exit(run.status || 1)
console.log(`wrote ${out}`)
