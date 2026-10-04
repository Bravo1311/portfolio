import { createContext, useContext, useEffect, useState } from 'react'

// Three reading depths. 'skim' is a recruiter's forty seconds,
// 'deep' is an engineer who wants to check your claims.
export const DEPTHS = [
  { id: 'skim', label: 'Skim', hint: 'Titles and status only' },
  { id: 'standard', label: 'Standard', hint: 'What each thing is' },
  { id: 'deep', label: 'Deep', hint: 'Every technical note open' },
]

const DepthContext = createContext({ depth: 'standard', setDepth: () => {} })

export const useDepth = () => useContext(DepthContext)

const readDepthFromUrl = () => {
  const requested = new URLSearchParams(window.location.search).get('depth')
  return DEPTHS.some((d) => d.id === requested) ? requested : 'standard'
}

export const DepthProvider = ({ children }) => {
  const [depth, setDepth] = useState(readDepthFromUrl)

  // Keep the URL in step so a chosen depth can be shared as a link.
  useEffect(() => {
    const url = new URL(window.location.href)
    if (depth === 'standard') url.searchParams.delete('depth')
    else url.searchParams.set('depth', depth)
    window.history.replaceState({}, '', url)
  }, [depth])

  return <DepthContext.Provider value={{ depth, setDepth }}>{children}</DepthContext.Provider>
}
