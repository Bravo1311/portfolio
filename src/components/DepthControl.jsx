import { DEPTHS, useDepth } from './DepthContext.jsx'
import { track } from '../lib/analytics.js'

// The three-way switch. It lives in the sticky bar so it stays within reach while scrolling.
export const DepthSwitch = () => {
  const { depth, setDepth } = useDepth()

  return (
    <div className="depth-switch" role="group" aria-label="How much detail to show">
      {DEPTHS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={option.id === depth ? 'depth-option depth-on' : 'depth-option'}
          aria-pressed={option.id === depth}
          title={option.hint}
          onClick={() => { track(`depth-${option.id}`); setDepth(option.id) }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// A one-line explanation under the bar, so the idea is clear the first time the page is seen.
const DepthHint = () => {
  const { depth } = useDepth()
  const active = DEPTHS.find((option) => option.id === depth)

  return (
    <div className="depth">
      <p className="depth-hint">{active.hint}. Any entry can also be opened on its own.</p>
    </div>
  )
}

export default DepthHint
