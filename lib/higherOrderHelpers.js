/**
 * Helper methods for higher order stuff.
 */

var notNeg1 = function (v) {
  return v != -1
};

var self = function (v) {
  return v
};

var toInt = function (v) {
  return parseInt(v)
};

var idNot0 = function (o) {
  return o.id != 0
};

var getParamMessageIds = function (param) {
  return param.split(',').filter(function (p) {
    return p.startsWith('{');
  }).map(function (p) {
    return parseInt(p.slice(1, -1));
  });
};