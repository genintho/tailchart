const configTypeConstructor = require("./widgetLoader");

module.exports = function widgetFactory(grid, config) {
  return config.widgets.map(screenConfig => {
    const cls = configTypeConstructor.get(screenConfig.type);
    const cleanConfig = cls.sanitizeConfig(screenConfig);
    return new cls(grid, cleanConfig);
  });
};
