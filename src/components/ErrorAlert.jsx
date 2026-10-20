function ErrorAlert({ message }) {
  if (!message) {
    return null
  }

  return (
    <div className="alert alert-danger mb-0" role="alert">
      {message}
    </div>
  )
}

export default ErrorAlert
