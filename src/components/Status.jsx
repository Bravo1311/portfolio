const LABELS = {
  done: 'Completed',
  progress: 'In progress',
}

const Status = ({ status }) =>
  LABELS[status] ? <span className={`status status-${status}`}>{LABELS[status]}</span> : null

export default Status
