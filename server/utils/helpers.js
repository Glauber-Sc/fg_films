// Generate a random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  return date.toISOString().split("T")[0]
}
