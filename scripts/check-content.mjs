// Checks src/data/cv.js (and the estimator data) for mistakes that would quietly break the page:
// duplicate ids, skills that point nowhere, broken links, malformed videos.
//   npm run check
// Errors stop the build (so a typo never gets published). Warnings are only reminders.
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cv = await import(pathToFileURL(path.join(root, 'src', 'data', 'cv.js')).href)
const { profile, tracks, experience, education, skills, evidence } = cv

const errors = []
const warnings = []
const err = (m) => errors.push(m)
const warn = (m) => warnings.push(m)

// ---- entries
const entries = [...tracks.flatMap((t) => t.entries.map((e) => ({ ...e, where: `track "${t.id}"` }))), ...experience.map((e) => ({ ...e, where: 'experience' })), ...education.map((e) => ({ ...e, where: 'education' }))]
const sectionIds = new Set([...tracks.map((t) => t.id), 'experience', 'education', 'skills'])
const seen = new Map()
for (const e of entries) {
  const name = `${e.where} / ${e.id || '(no id)'}`
  if (!e.id) err(`${name}: an entry has no id`)
  if (!e.title) err(`${name}: missing title`)
  if (!e.period) err(`${name}: missing period`)
  if (e.id && sectionIds.has(e.id)) err(`${name}: the id "${e.id}" is already used by a page section`)
  if (e.id && seen.has(e.id)) err(`${name}: duplicate id (also in ${seen.get(e.id)})`)
  seen.set(e.id, e.where)
  if (e.where.startsWith('track') && !['working', 'progress', 'planned'].includes(e.status)) err(`${name}: status must be 'working', 'progress' or 'planned' (got ${JSON.stringify(e.status)})`)
  for (const l of e.links || []) if (!/^(https?:|mailto:|tel:)/.test(l.href || '')) err(`${name}: link "${l.label}" has a bad address: ${l.href}`)
  for (const m of e.media || []) {
    if (!['plot', 'video', 'image'].includes(m.kind)) err(`${name}: media kind must be plot, video or image (got ${m.kind})`)
    if (m.kind === 'video' && !m.videoId && !m.src) warn(`${name}: a video slot is still empty ("${m.title || m.label}")`)
    if (m.kind === 'image' && !m.src) warn(`${name}: an image slot is still a placeholder ("${m.label}")`)
  }
}

// ---- profile
for (const l of profile.links) if (!/^(https?:|mailto:|tel:)/.test(l.href)) err(`profile: link "${l.label}" has a bad address: ${l.href}`)

// ---- skills and evidence
const skillNames = new Set(skills.flatMap((g) => g.items))
for (const [skill, ids] of Object.entries(evidence)) {
  if (!skillNames.has(skill)) err(`evidence: "${skill}" is not in the skills list (spelling must match exactly)`)
  for (const id of ids) if (!seen.has(id)) err(`evidence: "${skill}" points at "${id}", which is not an entry`)
}
const unlinked = [...skillNames].filter((s) => !evidence[s])

// ---- the navigation points at real sections
const nav = fs.readFileSync(path.join(root, 'src/components/Nav.jsx'), 'utf8')
for (const [, id] of nav.matchAll(/id: '([a-z-]+)'/g)) if (!sectionIds.has(id)) err(`Nav.jsx: link to "${id}", but no such section exists`)

// ---- estimator data
let illustrative = false
try {
  const d = JSON.parse(fs.readFileSync(path.join(root, 'src/data/estimator.json'), 'utf8'))
  const n = d.t.length
  if (d.truth.length !== n || d.estimate.length !== n) err('estimator.json: t, truth and estimate must have the same number of rows')
  if (d.dr && d.dr.length !== n) err('estimator.json: dr must have the same number of rows as t')
  illustrative = Boolean(d.meta && d.meta.illustrative)
} catch (e) {
  err(`estimator.json: ${e.message}`)
}
if (illustrative) warn('the estimator chart is still sample data (labelled "Illustrative" on the page)')

// ---- report
for (const w of warnings) console.log(`  warning  ${w}`)
for (const e of errors) console.log(`  ERROR    ${e}`)
console.log(`\n${entries.length} entries, ${Object.keys(evidence).length} skills linked to evidence, ${unlinked.length} skills with no evidence yet: ${errors.length} error(s), ${warnings.length} warning(s)`)

if (process.env.GITHUB_STEP_SUMMARY) {
  const md = [`### Content check`, ``, `| | |`, `|---|---|`, `| Entries | ${entries.length} |`, `| Skills linked to evidence | ${Object.keys(evidence).length} |`, `| Skills without evidence | ${unlinked.length}${unlinked.length ? ` (${unlinked.join(', ')})` : ''} |`, `| Errors | ${errors.length} |`, `| Reminders | ${warnings.length} |`, ``]
  if (warnings.length) md.push(...warnings.map((w) => `- ${w}`), ``)
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md.join('\n') + '\n')
}
process.exit(errors.length ? 1 : 0)