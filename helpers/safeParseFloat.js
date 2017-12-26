export default value => {
  const attempt = parseFloat(value)
  return isNaN(attempt) ? value : attempt
}