const _ = require("lodash");

module.exports = {
  sanitizeNumber: (config, key, defaultValue) => {
    // When default is undefined, it means the value must be define
    if (!config.hasOwnProperty("key")) {
      if (_.isUndefined(defaultValue)) {
        throw new Error(
          `Widget '${
            config.name
          }' is missing require integer attribute '${key}'`
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
};
