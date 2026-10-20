function Loader({ text = 'Загрузка…' }) {
  return (
    <div className="d-flex align-items-center gap-3 py-4" role="status">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

export default Loader
