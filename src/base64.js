
/**
  * Encodes javascript (ascii) string as base64.
  *
  * @param {string} str - The string to encode as base64.
  * @return {string} The encoded version of the string.
  */
export const toBase64 = str => new Buffer(str).toString('base64');

/**
  * Decodes base64 back into a javascript string.
  *
  * @param {string} b64 - The base64 encoded string to decode.
  * @return {string} The decoded version of the string.
  */
export const fromBase64 = b64 => new Buffer(b64, 'base64').toString('ascii');
