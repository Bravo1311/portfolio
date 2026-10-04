import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { evidence } from '../data/cv.js'
import { track } from '../lib/analytics.js'

const EvidenceContext = createContext({ skill: null, hits: [], cursor: 0, pick: () => {}, next: () => {}, clear: () => {} })

export const useEvidence = () => useContext(EvidenceContext)

const goTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// "Which work shows this skill?" Picking a skill highlights those entries and jumps to the first.
export const EvidenceProvider = ({ children }) => {
  const [skill, setSkill] = useState(null)
  const [cursor, setCursor] = useState(0)
  const hits = skill ? evidence[skill] || [] : []

  const pick = (name) => {
    if (skill === name) {
      setSkill(null)
      return
    }
    setSkill(name)
    setCursor(0)
    track('skill')
    const first = (evidence[name] || [])[0]
    if (first) window.setTimeout(() => goTo(first), 30)
  }

  const next = () => {
    if (hits.length < 2) return
    const c = (cursor + 1) % hits.length
    setCursor(c)
    goTo(hits[c])
  }

  const clear = () => setSkill(null)

  useEffect(() => {
    if (!skill) return undefined
    const onKey = (event) => event.key === 'Escape' && setSkill(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [skill])

  const value = useMemo(() => ({ skill, hits, cursor, pick, next, clear }), [skill, cursor]) // eslint-disable-line react-hooks/exhaustive-deps
  return <EvidenceContext.Provider value={value}>{children}</EvidenceContext.Provider>
}
