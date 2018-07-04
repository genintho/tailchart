module.exports = class ConfigError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ConfigError);
  }
};
