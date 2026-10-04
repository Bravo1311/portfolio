// Renders the built page through its print stylesheet into public/Kartik_Agrawal_CV.pdf.
// Run `npm run cv:pdf` after changing content, then commit the PDF. Needs Chrome or Chromium installed.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const page = resolve('dist/index.html')
const out = resolve('public/Kartik_Agrawal_CV.pdf')
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
