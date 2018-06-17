const _ = require("lodash");

module.exports = {
  sanitizeInteger: (config, key, defaultValue) => {
    // When default is undefined, it means the value must be define
    if (!config.hasOwnProperty(key)) {
      if (_.isUndefined(defaultValue)) {
        throw new Error(
          `Widget '${
            config.name
          }' is missing required integer attribute '${key}'`
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
  },
  sanitizeRegExp: (config, key) => {
    if (!config.hasOwnProperty(key)) {
      throw new Error(
        `Widget '${config.name}' is missing required attribute '${key}'`
      );
    }
    try {
      return new RegExp(config[key], "g");
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
};
