export function generateRandomText() {
  const charset
        = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const length = 30
  let retVal = ''

  for (let charsNumber = charset.length, index = 0; index < length; ++index)
    retVal += charset.charAt(Math.round(Math.random() * charsNumber))

  return retVal
}
