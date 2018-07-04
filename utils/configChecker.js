const _ = require("lodash");
const ConfigChecks = require("../utils/configChecks");
const ConfigError = require("../exceptions/ConfigError");
const configTypeConstructor = require("./widgetLoader");

module.exports = function(config) {
  if (!_.isString(config.source) || config.source.length === 0) {
    throw new ConfigError("Configuration must contain a 'source' ");
  }

  if (!_.isArray(config.widgets)) {
    throw new ConfigError("Configuration must have at least 1 widget");
  }

  if (!config.widgets.length) {
    throw new ConfigError("Configuration must have at least 1 widget");
  }

  const uniqueScreenName = new Set();
  config.widgets.forEach((screenConfig, index) => {
    if (!_.isPlainObject(screenConfig)) {
      throw new ConfigError(`Widget at index ${index} is not an object`);
    }

    if (_.isUndefined(screenConfig.name)) {
      throw new ConfigError(
        `Widget ${index + 1} is missing the required attribute 'name'`
      );
    }
    if (!_.isString(screenConfig.name)) {
      throw new ConfigError(`Widget ${index + 1} 'name' must be a string`);
    }
    if (uniqueScreenName.has(screenConfig.name)) {
      throw new ConfigError(
        `Multiple widgets with name '${screenConfig.name}'`
      );
    }
    uniqueScreenName.add(screenConfig.name);

    if (_.isUndefined(screenConfig.type)) {
      throw new ConfigError(`Widget '${screenConfig.name}' must have a type `);
    }

    if (!configTypeConstructor.has(screenConfig.type)) {
      const validTypes = Array.from(configTypeConstructor.keys()).join(",");
      throw new ConfigError(
        `Widget ${screenConfig.name} has an unknown type ${
          screenConfig.type
        }'. Valid types are: '${validTypes}'`
      );
    }

    ConfigChecks.global(screenConfig);
  });
  return true;
};
