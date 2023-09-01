export const multipleColumnsInput = (input) => {
  const keys = Object.keys(input)
  const values = Object.values(input)

  const columns = keys.map(key => `${key} = ?`).join(', ')

  return {
    columns,
    values
  }
}
