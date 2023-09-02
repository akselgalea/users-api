export const updateMultipleColumnsInput = (input) => {
  const keys = Object.keys(input)
  const values = Object.values(input)

  const columns = keys.map(key => `${key} = ?`).join(', ')

  return {
    columns,
    values
  }
}

export const searchMultipleColumnsInput = (input) => {
  const keys = Object.keys(input)
  const values = Object.values(input)

  const columns = keys.map(key => `${key} LIKE ?`).join(' OR ')
  const formattedValues = values.map(val => `%${val}%`)

  return {
    columns,
    values: formattedValues
  }
}
