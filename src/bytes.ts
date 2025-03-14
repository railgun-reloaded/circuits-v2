/**
 * Convert a Uint8Array to a 32 byte hex string
 * @param - Uint8Array representation of hex string
 * @returns - 0x Prefixed Hex String
 */
export function uint8ArrayToHexString (array: Uint8Array) {
  // Create empty hex string
  let hexString = ''

  // Loop through each byte of array
  array.forEach((byte) => {
    // Convert integer representation to base 16
    let hexByte = byte.toString(16)

    // Ensure 2 chars
    hexByte = hexByte.length === 1 ? '0' + hexByte : hexByte

    // Append to hexString
    hexString += hexByte
  })

  // Prefix with 0x
  return `0x${hexString}`
}
/**
 * Convert Uint8Array to a number string
 * @param array - Uint8Array representation of number
 * @returns - String representation of number
 */
export function uint8ArrayToNumberString (array: Uint8Array) {
  return BigInt(uint8ArrayToHexString(array)).toString()
}

export function arrayToByteLength (byteArray: Uint8Array, length: number) {
  // Check the length of array requested is large enough to accommodate the original array
  if (byteArray.length > length) throw new Error('BigInt byte size is larger than length')

  // Create Uint8Array of requested length
  return new Uint8Array(new Array(length - byteArray.length).concat(...byteArray))
}
/**
 * Convert number string to Uint8Array
 * @param bn - String representation of number
 * @param length  - Padded length required for hex string
 * @returns - Uint8Array representation of number string
 */
export function numberStringToUint8Array (ns: string, length: number): Uint8Array {
  // Convert bigint to hex string
  let hex = BigInt(ns).toString(16)

  // If hex is odd length then add leading zero
  if (hex.length % 2) hex = `0${hex}`

  // Split into groups of 2 to create hex array
  const hexArray = hex.match(/.{2}/g) ?? []

  // Convert hex array to uint8 byte array
  const byteArray = new Uint8Array(hexArray.map((byte) => parseInt(byte, 16)))

  return arrayToByteLength(byteArray, length)
}
