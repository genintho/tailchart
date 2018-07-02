const _ = require("lodash");

function _global(config) {
  return {
    name: config.name,
    row: _sanitizeInteger(config, "row"),
    col: _sanitizeInteger(config, "col"),
    rowspan: _sanitizeInteger(config, "rowspan"),
    colspan: _sanitizeInteger(config, "colspan")
  };
}
function _sanitizeInteger(config, key, defaultValue) {
  // When default is undefined, it means the value must be define
  if (!config.hasOwnProperty(key)) {
    if (_.isUndefined(defaultValue)) {
      throw new Error(
        `Widget '${config.name}' is missing required integer attribute '${key}'`
      );
    } else {
      return defaultValue;
    }
  }
  if (!_.isInteger(config[key])) {
    throw new Error(
      `Widget '${config.name}' attribute '${key}' must be an integer`
    );
  }
  return config[key];
}
function _sanitizeRegExp(config, key) {
  if (!config.hasOwnProperty(key)) {
    throw new Error(
      `Widget '${config.name}' is missing required attribute '${key}'`
    );
  }
  try {
    return new RegExp(config[key], "gi");
  } catch (e) {
    throw new Error(
      `Widget '${
        config.name
      }' attribute '${key}' must be a valid regular expression. Got Error ${
        e.message
      }`
    );
  }
}

module.exports = {
  global: _global,
  sanitizeInteger: _sanitizeInteger,
  sanitizeRegExp: _sanitizeRegExp
};
