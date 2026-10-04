const LABELS = {
  working: 'Working',
  progress: 'In progress',
  planned: 'Planned',
}

const Status = ({ status }) =>
  LABELS[status] ? <span className={`status status-${status}`}>{LABELS[status]}</span> : null

export default Status
