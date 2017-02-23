/**
 * Helper methods for higher order stuff.
 */

/**
 * Helper method for checking if object is not -1.
 *
 * @param v the number
 * @returns true if object is not -1, false otherwise.
 */
function notNeg1(v) {
  return v != -1;
}

/**
 * Helper method for checking if object is not 0.
 *
 * @param v the number
 * @returns true if object is not 0, false otherwise
 */
function not0(v) {
  return v != 0;
}

/**
 * Returns self
 *
 * @param v the object
 * @returns the object
 */
function self(v) {
  return v;
}

/**
 * Casts object (usually string) to integer
 * @param v the object
 * @returns number
 */
function toInt(v) {
  return parseInt(v)
}

/**
 * Checks if id property of object is 0 or not.
 *
 * @param o the object
 * @returns true if object's id property is not 0, false otherwise
 */
function idNot0(o) {
  return not0(o.id)
}

/**
 * Gets the message id(s) from a param string.
 *
 * @param param the param string
 * @returns list of message ids
 */
function getParamMessageIds(param) {
  return param.split(',').filter(function (p) {
    return p.startsWith('{');
  }).map(function (p) {
    return parseInt(p.slice(1, -1));
  });
}